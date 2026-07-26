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

const UTILITY_BILL_INCLUDE = {
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
  "utilityType",
  "providerName",
  "accountNumber",
  "billNumber",
  "billMonth",
  "billDate",
  "dueDate",
  "paidDate",
  "amountDue",
  "amountPaid",
  "receiptUrl",
  "notes",
  "transactionId",
  "importId",
];

const ALLOWED_UPDATE_FIELDS = [...ALLOWED_CREATE_FIELDS];

// ---------------------------------------------------------------------------
// UtilityBillService
// ---------------------------------------------------------------------------

class UtilityBillService {
  // -------------------------------------------------------------------------
  // CREATE
  // -------------------------------------------------------------------------

  async createUtilityBill(userId, data, context = {}) {
    // Validate linked transaction
    if (data.transactionId) {
      await this._validateTransaction(userId, data.transactionId);
    }

    // Validate linked import
    if (data.importId) {
      await this._validateImport(userId, data.importId);
    }

    const safeData = this._pickAllowedFields(
      data,
      ALLOWED_CREATE_FIELDS
    );

    safeData.billDate = data.billDate
      ? new Date(data.billDate)
      : null;

    safeData.dueDate = new Date(data.dueDate);

    safeData.paidDate = data.paidDate
      ? new Date(data.paidDate)
      : null;

    // -----------------------------------------------------------------------
    // Derive status
    // -----------------------------------------------------------------------

    safeData.status = this._calculateStatus(
      Number(data.amountDue),
      Number(data.amountPaid || 0),
      safeData.dueDate,
      safeData.paidDate
    );

    // -----------------------------------------------------------------------
    // Derive payment delay
    // -----------------------------------------------------------------------

    safeData.paymentDelayDays =
      this._calculateDelayDays(
        safeData.dueDate,
        safeData.paidDate
      );

    const utilityBill = await prisma.$transaction(async (tx) => {
      return tx.utilityBill.create({
        data: {
          ...safeData,
          userId,
        },
        include: UTILITY_BILL_INCLUDE,
      });
    });

    await auditService.log({
      userId,
      action: "UTILITY_BILL_CREATE",
      description: `Utility bill "${utilityBill.id}" created (${utilityBill.utilityType}) for ₹${utilityBill.amountDue}.`,
      ...context,
    });

    return utilityBill;
  }

    // -------------------------------------------------------------------------
  // GET BY ID
  // -------------------------------------------------------------------------

  async getUtilityBill(userId, billId) {
    const bill = await prisma.utilityBill.findFirst({
      where: {
        id: billId,
        userId,
      },
      include: UTILITY_BILL_INCLUDE,
    });

    if (!bill) {
      throw new NotFoundError("Utility bill not found.");
    }

    return bill;
  }

  // -------------------------------------------------------------------------
  // LIST
  // -------------------------------------------------------------------------

  async listUtilityBills(userId, query = {}) {
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

    const [total, bills] = await prisma.$transaction([
      prisma.utilityBill.count({
        where,
      }),

      prisma.utilityBill.findMany({
        where,
        include: UTILITY_BILL_INCLUDE,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      bills,

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

  async updateUtilityBill(
    userId,
    billId,
    data,
    context = {}
  ) {
    const existing = await prisma.utilityBill.findFirst({
      where: {
        id: billId,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError("Utility bill not found.");
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

    if (data.billDate) {
      safeData.billDate = new Date(data.billDate);
    }

    if (data.dueDate) {
      safeData.dueDate = new Date(data.dueDate);
    }

    if (data.paidDate) {
      safeData.paidDate = new Date(data.paidDate);
    }

    const amountDue =
      data.amountDue !== undefined
        ? Number(data.amountDue)
        : Number(existing.amountDue);

    const amountPaid =
      data.amountPaid !== undefined
        ? Number(data.amountPaid)
        : Number(existing.amountPaid);

    const dueDate =
      safeData.dueDate || existing.dueDate;

    const paidDate =
      safeData.paidDate || existing.paidDate;

    safeData.status = this._calculateStatus(
      amountDue,
      amountPaid,
      dueDate,
      paidDate
    );

    safeData.paymentDelayDays =
      this._calculateDelayDays(
        dueDate,
        paidDate
      );

    const bill = await prisma.$transaction(async (tx) => {
      return tx.utilityBill.update({
        where: {
          id: billId,
        },
        data: safeData,
        include: UTILITY_BILL_INCLUDE,
      });
    });

    await auditService.log({
      userId,
      action: "UTILITY_BILL_UPDATE",
      description: `Utility bill "${billId}" updated.`,
      ...context,
    });

    return bill;
  }

  // -------------------------------------------------------------------------
  // DELETE
  // -------------------------------------------------------------------------

  async deleteUtilityBill(
    userId,
    billId,
    context = {}
  ) {
    const existing = await prisma.utilityBill.findFirst({
      where: {
        id: billId,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError("Utility bill not found.");
    }

    await prisma.utilityBill.delete({
      where: {
        id: billId,
      },
    });

    await auditService.log({
      userId,
      action: "UTILITY_BILL_DELETE",
      description: `Utility bill "${billId}" deleted.`,
      ...context,
    });

    return { success: true };
  }
    // -------------------------------------------------------------------------
  // STATISTICS
  // -------------------------------------------------------------------------

  async getUtilityBillStatistics(userId) {
    const bills = await prisma.utilityBill.findMany({
      where: { userId },
    });

    const totalBills = bills.length;

    const paid = bills.filter((b) => b.status === "PAID").length;
    const partial = bills.filter((b) => b.status === "PARTIAL").length;
    const pending = bills.filter((b) => b.status === "PENDING").length;
    const missed = bills.filter((b) => b.status === "MISSED").length;

    const totalAmountDue = bills.reduce(
      (sum, b) => sum + Number(b.amountDue),
      0
    );

    const totalAmountPaid = bills.reduce(
      (sum, b) => sum + Number(b.amountPaid),
      0
    );

    const paidBills = bills.filter(
      (b) => b.paymentDelayDays !== null
    );

    const averageDelayDays =
      paidBills.length > 0
        ? paidBills.reduce(
            (sum, b) => sum + b.paymentDelayDays,
            0
          ) / paidBills.length
        : 0;

    const providerMap = {};

    bills.forEach((bill) => {
      if (!providerMap[bill.providerName]) {
        providerMap[bill.providerName] = {
          provider: bill.providerName,
          count: 0,
          amount: 0,
        };
      }

      providerMap[bill.providerName].count++;

      providerMap[bill.providerName].amount += Number(
        bill.amountDue
      );
    });

    return {
      totalBills,
      paid,
      partial,
      pending,
      missed,

      totalAmountDue,
      totalAmountPaid,

      averageDelayDays,

      paymentConsistency:
        totalBills === 0
          ? 100
          : Number(
              (((paid + partial) / totalBills) * 100).toFixed(2)
            ),

      providers: Object.values(providerMap),
    };
  }

  // -------------------------------------------------------------------------
  // PRIVATE HELPERS
  // -------------------------------------------------------------------------

  _calculateStatus(amountDue, amountPaid, dueDate, paidDate) {
    if (amountPaid >= amountDue) {
      return "PAID";
    }

    if (amountPaid > 0 && amountPaid < amountDue) {
      return "PARTIAL";
    }

    if (
      amountPaid === 0 &&
      new Date(dueDate) < new Date()
    ) {
      return "MISSED";
    }

    return "PENDING";
  }

  _calculateDelayDays(dueDate, paidDate) {
    if (!paidDate) {
      return null;
    }

    const diff =
      new Date(paidDate) - new Date(dueDate);

    return Math.max(
      0,
      Math.floor(diff / (1000 * 60 * 60 * 24))
    );
  }

  async _validateTransaction(userId, transactionId) {
    const transaction = await prisma.transaction.findFirst({
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

  async _validateImport(userId, importId) {
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

    if (query.utilityType) {
      where.utilityType = query.utilityType;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.billMonth) {
      where.billMonth = query.billMonth;
    }

    if (query.provider) {
      where.providerName = {
        contains: query.provider,
        mode: "insensitive",
      };
    }

    if (query.startDate || query.endDate) {
      where.dueDate = {};

      if (query.startDate) {
        where.dueDate.gte = new Date(query.startDate);
      }

      if (query.endDate) {
        where.dueDate.lte = new Date(query.endDate);
      }
    }

    if (query.minAmount || query.maxAmount) {
      where.amountDue = {};

      if (query.minAmount) {
        where.amountDue.gte = Number(query.minAmount);
      }

      if (query.maxAmount) {
        where.amountDue.lte = Number(query.maxAmount);
      }
    }

    if (query.search) {
      where.OR = [
        {
          providerName: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          accountNumber: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          billNumber: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          notes: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ];
    }

    return where;
  }

  _buildOrderBy(sortBy, order) {
    const direction = order === "asc" ? "asc" : "desc";

    const map = {
      dueDate: "dueDate",
      billDate: "billDate",
      amountDue: "amountDue",
      createdAt: "createdAt",
    };

    return {
      [map[sortBy] || "dueDate"]: direction,
    };
  }

  _pickAllowedFields(data, allowedFields) {
    const result = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        result[field] = data[field];
      }
    }

    return result;
  }

  async _findById(id) {
    return prisma.utilityBill.findUnique({
      where: { id },
      include: UTILITY_BILL_INCLUDE,
    });
  }
}

module.exports = new UtilityBillService();