const prisma = require("../config/prisma");

const auditService = require("./audit.service");

const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

// ---------------------------------------------------------------------------
// Shared Include
// ---------------------------------------------------------------------------

const MOBILE_RECHARGE_INCLUDE = {
  transaction: {
    select: {
      id: true,
      amount: true,
      transactionType: true,
      transactionDate: true,
    },
  },
  import: {
    select: {
      id: true,
      source: true,
      importedAt: true,
    },
  },
};

// ---------------------------------------------------------------------------
// Allowed Fields
// ---------------------------------------------------------------------------

const ALLOWED_CREATE_FIELDS = [
  "provider",
  "mobileNumber",
  "amount",
  "rechargeDate",
  "validityDays",
  "status",
  "isEmergencyRecharge",
  "planType",
  "referenceNumber",
  "transactionId",
  "importId",
];

const ALLOWED_UPDATE_FIELDS = [...ALLOWED_CREATE_FIELDS];

// ---------------------------------------------------------------------------
// MobileRechargeService
// ---------------------------------------------------------------------------

class MobileRechargeService {

  // -------------------------------------------------------------------------
  // CREATE
  // -------------------------------------------------------------------------

  async createMobileRecharge(userId, data, context = {}) {

    if (data.transactionId) {
      await this._validateTransaction(
        userId,
        data.transactionId
      );
    }

    if (data.importId) {
      await this._validateImport(
        userId,
        data.importId
      );
    }

    const safeData = this._pickAllowedFields(
      data,
      ALLOWED_CREATE_FIELDS
    );

    safeData.rechargeDate = new Date(data.rechargeDate);

    const recharge = await prisma.$transaction(async (tx) => {

      return tx.mobileRecharge.create({

        data: {
          ...safeData,
          userId,
        },

        include: MOBILE_RECHARGE_INCLUDE,

      });

    });

    await auditService.log({

      userId,

      action: "MOBILE_RECHARGE_CREATE",

      description:
        `Mobile recharge "${recharge.id}" created (${recharge.provider}) ₹${recharge.amount}.`,

      ...context,

    });

    return recharge;
  }

    // -------------------------------------------------------------------------
  // GET BY ID
  // -------------------------------------------------------------------------

  async getMobileRecharge(userId, rechargeId) {
    const recharge = await prisma.mobileRecharge.findFirst({
      where: {
        id: rechargeId,
        userId,
      },
      include: MOBILE_RECHARGE_INCLUDE,
    });

    if (!recharge) {
      throw new NotFoundError("Mobile recharge not found.");
    }

    return recharge;
  }

  // -------------------------------------------------------------------------
  // LIST
  // -------------------------------------------------------------------------

  async listMobileRecharges(userId, query = {}) {
    const page = Number(query.page || DEFAULT_PAGE);

    const limit = Math.min(
      Number(query.limit || DEFAULT_LIMIT),
      MAX_LIMIT
    );

    const where = this._buildWhereClause(userId, query);

    const orderBy = this._buildOrderBy(
      query.sortBy,
      query.order
    );

    const [total, recharges] = await prisma.$transaction([
      prisma.mobileRecharge.count({
        where,
      }),

      prisma.mobileRecharge.findMany({
        where,
        include: MOBILE_RECHARGE_INCLUDE,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      recharges,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // -------------------------------------------------------------------------
  // UPDATE
  // -------------------------------------------------------------------------

  async updateMobileRecharge(
    userId,
    rechargeId,
    data,
    context = {}
  ) {
    const existing = await prisma.mobileRecharge.findFirst({
      where: {
        id: rechargeId,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError(
        "Mobile recharge not found."
      );
    }

    if (data.transactionId) {
      await this._validateTransaction(
        userId,
        data.transactionId
      );
    }

    if (data.importId) {
      await this._validateImport(
        userId,
        data.importId
      );
    }

    const safeData = this._pickAllowedFields(
      data,
      ALLOWED_UPDATE_FIELDS
    );

    if (data.rechargeDate) {
      safeData.rechargeDate = new Date(
        data.rechargeDate
      );
    }

    const recharge = await prisma.$transaction(
      async (tx) => {
        return tx.mobileRecharge.update({
          where: {
            id: rechargeId,
          },

          data: safeData,

          include: MOBILE_RECHARGE_INCLUDE,
        });
      }
    );

    await auditService.log({
      userId,

      action: "MOBILE_RECHARGE_UPDATE",

      description: `Mobile recharge "${rechargeId}" updated.`,

      ...context,
    });

    return recharge;
  }

  // -------------------------------------------------------------------------
  // DELETE
  // -------------------------------------------------------------------------

  async deleteMobileRecharge(
    userId,
    rechargeId,
    context = {}
  ) {
    const existing = await prisma.mobileRecharge.findFirst({
      where: {
        id: rechargeId,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError(
        "Mobile recharge not found."
      );
    }

    await prisma.mobileRecharge.delete({
      where: {
        id: rechargeId,
      },
    });

    await auditService.log({
      userId,

      action: "MOBILE_RECHARGE_DELETE",

      description: `Mobile recharge "${rechargeId}" deleted.`,

      ...context,
    });

    return {
      success: true,
    };
  }
    // -------------------------------------------------------------------------
  // STATISTICS
  // -------------------------------------------------------------------------

  async getMobileRechargeStatistics(userId) {
    const recharges = await prisma.mobileRecharge.findMany({
      where: { userId },
    });

    const totalRecharges = recharges.length;

    const totalAmount = recharges.reduce(
      (sum, recharge) => sum + Number(recharge.amount),
      0
    );

    const averageAmount =
      totalRecharges === 0
        ? 0
        : Number((totalAmount / totalRecharges).toFixed(2));

    const successCount = recharges.filter(
      (r) => r.status === "SUCCESS"
    ).length;

    const failedCount = recharges.filter(
      (r) => r.status === "FAILED"
    ).length;

    const pendingCount = recharges.filter(
      (r) => r.status === "PENDING"
    ).length;

    const emergencyRechargeCount = recharges.filter(
      (r) => r.isEmergencyRecharge
    ).length;

    // ---------------------------------------------------------------------
    // Average Recharge Interval
    // ---------------------------------------------------------------------

    const sorted = [...recharges].sort(
      (a, b) =>
        new Date(a.rechargeDate) -
        new Date(b.rechargeDate)
    );

    let totalInterval = 0;

    for (let i = 1; i < sorted.length; i++) {
      totalInterval +=
        (new Date(sorted[i].rechargeDate) -
          new Date(sorted[i - 1].rechargeDate)) /
        (1000 * 60 * 60 * 24);
    }

    const averageInterval =
      sorted.length > 1
        ? Number(
            (
              totalInterval /
              (sorted.length - 1)
            ).toFixed(2)
          )
        : 0;

    // ---------------------------------------------------------------------
    // Provider Analytics
    // ---------------------------------------------------------------------

    const providerMap = {};

    for (const recharge of recharges) {
      if (!providerMap[recharge.provider]) {
        providerMap[recharge.provider] = {
          provider: recharge.provider,
          count: 0,
          amount: 0,
        };
      }

      providerMap[recharge.provider].count++;

      providerMap[recharge.provider].amount +=
        Number(recharge.amount);
    }

    return {
      totalRecharges,

      totalAmount,

      averageAmount,

      averageRechargeIntervalDays:
        averageInterval,

      successCount,

      failedCount,

      pendingCount,

      emergencyRechargeCount,

      providers: Object.values(providerMap),
    };
  }

  // -------------------------------------------------------------------------
  // PRIVATE HELPERS
  // -------------------------------------------------------------------------

  async _validateTransaction(
    userId,
    transactionId
  ) {
    const transaction =
      await prisma.transaction.findFirst({
        where: {
          id: transactionId,
          userId,
        },
      });

    if (!transaction) {
      throw new BadRequestError(
        "Linked transaction not found."
      );
    }
  }

  async _validateImport(
    userId,
    importId
  ) {
    const importRecord =
      await prisma.financialImport.findFirst({
        where: {
          id: importId,
          userId,
        },
      });

    if (!importRecord) {
      throw new BadRequestError(
        "Financial import not found."
      );
    }
  }

  _buildWhereClause(userId, query) {
    const where = { userId };

    if (query.provider) {
      where.provider = query.provider;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.mobileNumber) {
      where.mobileNumber = {
        contains: query.mobileNumber,
        mode: "insensitive",
      };
    }

    if (query.startDate || query.endDate) {
      where.rechargeDate = {};

      if (query.startDate) {
        where.rechargeDate.gte = new Date(
          query.startDate
        );
      }

      if (query.endDate) {
        where.rechargeDate.lte = new Date(
          query.endDate
        );
      }
    }

    if (query.minAmount || query.maxAmount) {
      where.amount = {};

      if (query.minAmount) {
        where.amount.gte = Number(
          query.minAmount
        );
      }

      if (query.maxAmount) {
        where.amount.lte = Number(
          query.maxAmount
        );
      }
    }

    if (query.search) {
      where.OR = [
        {
          mobileNumber: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          planType: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          referenceNumber: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ];
    }

    return where;
  }

  _buildOrderBy(sortBy, order) {
    const direction =
      order === "asc" ? "asc" : "desc";

    const map = {
      rechargeDate: "rechargeDate",
      amount: "amount",
      createdAt: "createdAt",
    };

    return {
      [map[sortBy] || "rechargeDate"]:
        direction,
    };
  }

  _pickAllowedFields(
    data,
    allowedFields
  ) {
    const result = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        result[field] = data[field];
      }
    }

    return result;
  }

  async _findById(id) {
    return prisma.mobileRecharge.findUnique({
      where: {
        id,
      },
      include: MOBILE_RECHARGE_INCLUDE,
    });
  }
}

module.exports = new MobileRechargeService();