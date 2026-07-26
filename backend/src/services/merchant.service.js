const prisma = require("../config/prisma");

const auditService = require("./audit.service");

const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

// -----------------------------------------------------------------------------
// Shared Include
// -----------------------------------------------------------------------------

const MERCHANT_INCLUDE = {

  _count: {

    select: {

      transactions: true,

      ecommerceOrders: true,

    },

  },

};

// -----------------------------------------------------------------------------
// Allowed Fields
// -----------------------------------------------------------------------------

const ALLOWED_CREATE_FIELDS = [

  "name",

  "code",

  "category",

  "logoUrl",

  "website",

  "isVerified",

];

const ALLOWED_UPDATE_FIELDS = [...ALLOWED_CREATE_FIELDS];

// -----------------------------------------------------------------------------
// Service
// -----------------------------------------------------------------------------

class MerchantService {

  // ---------------------------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------------------------

  async createMerchant(
    data,
    context = {}
  ) {

    const safeData =
      this._pickAllowedFields(
        data,
        ALLOWED_CREATE_FIELDS
      );

    const merchant =
      await prisma.merchant.create({

        data: safeData,

        include:
          MERCHANT_INCLUDE,

      });

    await auditService.log({

      action:
        "MERCHANT_CREATE",

      description:
        `Merchant "${merchant.name}" created.`,

      ...context,

    });

    return merchant;
  }

  // ---------------------------------------------------------------------------
  // GET
  // ---------------------------------------------------------------------------

  async getMerchant(id) {

    const merchant =
      await prisma.merchant.findUnique({

        where: {
          id,
        },

        include:
          MERCHANT_INCLUDE,

      });

    if (!merchant) {

      throw new NotFoundError(
        "Merchant not found."
      );

    }

    return merchant;
  }

  // ---------------------------------------------------------------------------
  // LIST
  // ---------------------------------------------------------------------------

  async listMerchants(
    query = {}
  ) {

    const page =
      Number(query.page || DEFAULT_PAGE);

    const limit = Math.min(
      Number(query.limit || DEFAULT_LIMIT),
      MAX_LIMIT
    );

    const where =
      this._buildWhereClause(query);

    const orderBy =
      this._buildOrderBy(
        query.sortBy,
        query.order
      );

    const [total, merchants] =
      await prisma.$transaction([

        prisma.merchant.count({

          where,

        }),

        prisma.merchant.findMany({

          where,

          include:
            MERCHANT_INCLUDE,

          orderBy,

          skip:
            (page - 1) * limit,

          take:
            limit,

        }),

      ]);

    return {

      merchants,

      pagination: {

        page,

        limit,

        total,

        totalPages:
          Math.ceil(total / limit),

      },

    };
  }  // ---------------------------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------------------------

  async updateMerchant(
    merchantId,
    data,
    context = {}
  ) {

    const existing =
      await prisma.merchant.findUnique({

        where: {
          id: merchantId,
        },

      });

    if (!existing) {
      throw new NotFoundError(
        "Merchant not found."
      );
    }

    const safeData =
      this._pickAllowedFields(
        data,
        ALLOWED_UPDATE_FIELDS
      );

    const merchant =
      await prisma.merchant.update({

        where: {
          id: merchantId,
        },

        data: safeData,

        include:
          MERCHANT_INCLUDE,

      });

    await auditService.log({

      action:
        "MERCHANT_UPDATE",

      description:
        `Merchant "${merchant.name}" updated.`,

      ...context,

    });

    return merchant;
  }

  // ---------------------------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------------------------

  async deleteMerchant(
    merchantId,
    context = {}
  ) {

    const merchant =
      await prisma.merchant.findUnique({

        where: {
          id: merchantId,
        },

        include: {

          _count: {

            select: {

              transactions: true,

              ecommerceOrders: true,

            },

          },

        },

      });

    if (!merchant) {
      throw new NotFoundError(
        "Merchant not found."
      );
    }

    if (merchant._count.transactions > 0) {
      throw new BadRequestError(
        "Cannot delete merchant linked to transactions."
      );
    }

    if (merchant._count.ecommerceOrders > 0) {
      throw new BadRequestError(
        "Cannot delete merchant linked to ecommerce orders."
      );
    }

    await prisma.merchant.delete({

      where: {
        id: merchantId,
      },

    });

    await auditService.log({

      action:
        "MERCHANT_DELETE",

      description:
        `Merchant "${merchant.name}" deleted.`,

      ...context,

    });

    return {
      success: true,
    };
  }

  // ---------------------------------------------------------------------------
  // STATISTICS
  // ---------------------------------------------------------------------------

  async getMerchantStatistics() {

    const merchants =
      await prisma.merchant.findMany({

        include: {

          _count: {

            select: {

              transactions: true,

              ecommerceOrders: true,

            },

          },

        },

      });

    const totalMerchants =
      merchants.length;

    const verifiedMerchants =
      merchants.filter(
        (m) => m.isVerified
      ).length;

    const unverifiedMerchants =
      totalMerchants -
      verifiedMerchants;

    const transactionLinks =
      merchants.reduce(
        (sum, merchant) =>
          sum +
          merchant._count.transactions,
        0
      );

    const ecommerceLinks =
      merchants.reduce(
        (sum, merchant) =>
          sum +
          merchant._count.ecommerceOrders,
        0
      );

    // -------------------------------------------------------------------------
    // Merchant Category Breakdown
    // -------------------------------------------------------------------------

    const categoryMap = {};

    for (const merchant of merchants) {

      const category =
        merchant.category ||
        "Uncategorized";

      if (!categoryMap[category]) {

        categoryMap[category] = {

          category,

          merchants: 0,

        };

      }

      categoryMap[category]
        .merchants++;

    }

    // -------------------------------------------------------------------------
    // Most Used Merchants
    // -------------------------------------------------------------------------

    const mostUsedMerchants =
      [...merchants]
        .sort(
          (a, b) =>
            (b._count.transactions +
              b._count.ecommerceOrders) -
            (a._count.transactions +
              a._count.ecommerceOrders)
        )
        .slice(0, 10)
        .map((merchant) => ({
          id: merchant.id,
          name: merchant.name,
          code: merchant.code,
          category: merchant.category,
          isVerified:
            merchant.isVerified,
          transactionCount:
            merchant._count.transactions,
          ecommerceOrderCount:
            merchant._count.ecommerceOrders,
          totalUsage:
            merchant._count.transactions +
            merchant._count.ecommerceOrders,
        }));

    return {

      totalMerchants,

      verifiedMerchants,

      unverifiedMerchants,

      transactionLinks,

      ecommerceLinks,

      categoryBreakdown:
        Object.values(
          categoryMap
        ),

      mostUsedMerchants,

    };
  }
    // ---------------------------------------------------------------------------
  // PRIVATE HELPERS
  // ---------------------------------------------------------------------------

  _buildWhereClause(query) {

    const where = {};

    if (query.category) {
      where.category = {
        contains: query.category,
        mode: "insensitive",
      };
    }

    if (query.isVerified !== undefined) {
      where.isVerified =
        query.isVerified === "true";
    }

    if (query.search) {

      where.OR = [

        {
          name: {
            contains: query.search,
            mode: "insensitive",
          },
        },

        {
          code: {
            contains: query.search,
            mode: "insensitive",
          },
        },

        {
          category: {
            contains: query.search,
            mode: "insensitive",
          },
        },

        {
          website: {
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
      order === "asc"
        ? "asc"
        : "desc";

    const map = {

      name: "name",

      createdAt: "createdAt",

      updatedAt: "updatedAt",

      category: "category",

      isVerified: "isVerified",

    };

    return {
      [map[sortBy] || "name"]:
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

    return prisma.merchant.findUnique({

      where: {
        id,
      },

      include: MERCHANT_INCLUDE,

    });

  }

}

module.exports = new MerchantService();