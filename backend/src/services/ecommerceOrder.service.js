const prisma = require("../config/prisma");

const auditService = require("./audit.service");

const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

// -----------------------------------------------------------------------------
// Shared Include
// -----------------------------------------------------------------------------

const ECOMMERCE_ORDER_INCLUDE = {
  transaction: {
    select: {
      id: true,
      amount: true,
      transactionType: true,
      transactionDate: true,
    },
  },

  merchant: {
    select: {
      id: true,
      name: true,
      merchantType: true,
    },
  },

  category: {
    select: {
      id: true,
      name: true,
      type: true,
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

// -----------------------------------------------------------------------------
// Allowed Fields
// -----------------------------------------------------------------------------

const ALLOWED_CREATE_FIELDS = [
  "platform",
  "orderId",
  "orderDate",
  "amount",
  "status",
  "paymentMode",
  "itemCount",
  "isReturned",
  "isRefunded",
  "merchantId",
  "categoryId",
  "transactionId",
  "importId",
];

const ALLOWED_UPDATE_FIELDS = [...ALLOWED_CREATE_FIELDS];

// -----------------------------------------------------------------------------
// Service
// -----------------------------------------------------------------------------

class EcommerceOrderService {

  // ---------------------------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------------------------

  async createEcommerceOrder(
    userId,
    data,
    context = {}
  ) {

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

    if (data.merchantId) {
      await this._validateMerchant(
        userId,
        data.merchantId
      );
    }

    if (data.categoryId) {
      await this._validateCategory(
        userId,
        data.categoryId
      );
    }

    const safeData = this._pickAllowedFields(
      data,
      ALLOWED_CREATE_FIELDS
    );

    safeData.orderDate = new Date(
      data.orderDate
    );

    const order = await prisma.$transaction(
      async (tx) => {

        return tx.ecommerceOrder.create({

          data: {
            ...safeData,
            userId,
          },

          include:
            ECOMMERCE_ORDER_INCLUDE,

        });

      }
    );

    await auditService.log({

      userId,

      action: "ECOMMERCE_ORDER_CREATE",

      description:
        `E-commerce order "${order.id}" created on ${order.platform}.`,

      ...context,

    });

    return order;
  }

  // ---------------------------------------------------------------------------
  // GET
  // ---------------------------------------------------------------------------

  async getEcommerceOrder(
    userId,
    orderId
  ) {

    const order =
      await prisma.ecommerceOrder.findFirst({

        where: {
          id: orderId,
          userId,
        },

        include:
          ECOMMERCE_ORDER_INCLUDE,

      });

    if (!order) {
      throw new NotFoundError(
        "E-commerce order not found."
      );
    }

    return order;
  }

  // ---------------------------------------------------------------------------
  // LIST
  // ---------------------------------------------------------------------------

  async listEcommerceOrders(
    userId,
    query = {}
  ) {

    const page =
      Number(query.page || DEFAULT_PAGE);

    const limit = Math.min(
      Number(query.limit || DEFAULT_LIMIT),
      MAX_LIMIT
    );

    const where =
      this._buildWhereClause(
        userId,
        query
      );

    const orderBy =
      this._buildOrderBy(
        query.sortBy,
        query.order
      );

    const [total, orders] =
      await prisma.$transaction([

        prisma.ecommerceOrder.count({
          where,
        }),

        prisma.ecommerceOrder.findMany({

          where,

          include:
            ECOMMERCE_ORDER_INCLUDE,

          orderBy,

          skip:
            (page - 1) * limit,

          take: limit,

        }),

      ]);

    return {

      orders,

      pagination: {

        page,

        limit,

        total,

        totalPages:
          Math.ceil(total / limit),

      },

    };
  }

    // ---------------------------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------------------------

  async updateEcommerceOrder(
    userId,
    orderId,
    data,
    context = {}
  ) {

    const existing =
      await prisma.ecommerceOrder.findFirst({

        where: {
          id: orderId,
          userId,
        },

      });

    if (!existing) {
      throw new NotFoundError(
        "E-commerce order not found."
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

    if (data.merchantId) {
      await this._validateMerchant(
        userId,
        data.merchantId
      );
    }

    if (data.categoryId) {
      await this._validateCategory(
        userId,
        data.categoryId
      );
    }

    const safeData =
      this._pickAllowedFields(
        data,
        ALLOWED_UPDATE_FIELDS
      );

    if (data.orderDate) {
      safeData.orderDate =
        new Date(data.orderDate);
    }

    const order =
      await prisma.$transaction(
        async (tx) => {

          return tx.ecommerceOrder.update({

            where: {
              id: orderId,
            },

            data: safeData,

            include:
              ECOMMERCE_ORDER_INCLUDE,

          });

        }
      );

    await auditService.log({

      userId,

      action:
        "ECOMMERCE_ORDER_UPDATE",

      description:
        `E-commerce order "${orderId}" updated.`,

      ...context,

    });

    return order;
  }

  // ---------------------------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------------------------

  async deleteEcommerceOrder(
    userId,
    orderId,
    context = {}
  ) {

    const existing =
      await prisma.ecommerceOrder.findFirst({

        where: {
          id: orderId,
          userId,
        },

      });

    if (!existing) {
      throw new NotFoundError(
        "E-commerce order not found."
      );
    }

    await prisma.ecommerceOrder.delete({

      where: {
        id: orderId,
      },

    });

    await auditService.log({

      userId,

      action:
        "ECOMMERCE_ORDER_DELETE",

      description:
        `E-commerce order "${orderId}" deleted.`,

      ...context,

    });

    return {
      success: true,
    };
  }

  // ---------------------------------------------------------------------------
  // STATISTICS
  // ---------------------------------------------------------------------------

  async getEcommerceOrderStatistics(
    userId
  ) {

    const orders =
      await prisma.ecommerceOrder.findMany({

        where: {
          userId,
        },

      });

    const totalOrders =
      orders.length;

    const totalSpend =
      orders.reduce(
        (sum, order) =>
          sum + Number(order.amount),
        0
      );

    const averageOrderValue =
      totalOrders === 0
        ? 0
        : Number(
            (
              totalSpend /
              totalOrders
            ).toFixed(2)
          );

    const returnedOrders =
      orders.filter(
        (o) => o.isReturned
      ).length;

    const refundedOrders =
      orders.filter(
        (o) => o.isRefunded
      ).length;

    const cancelledOrders =
      orders.filter(
        (o) =>
          o.status ===
          "CANCELLED"
      ).length;

    const pendingOrders =
      orders.filter(
        (o) =>
          o.status ===
          "PENDING"
      ).length;

    const deliveredOrders =
      orders.filter(
        (o) =>
          o.status ===
          "DELIVERED"
      ).length;

    const shippedOrders =
      orders.filter(
        (o) =>
          o.status ===
          "SHIPPED"
      ).length;

    const largestOrder =
      totalOrders
        ? Math.max(
            ...orders.map((o) =>
              Number(o.amount)
            )
          )
        : 0;

    const smallestOrder =
      totalOrders
        ? Math.min(
            ...orders.map((o) =>
              Number(o.amount)
            )
          )
        : 0;

    const averageItemsPerOrder =
      totalOrders === 0
        ? 0
        : Number(
            (
              orders.reduce(
                (sum, order) =>
                  sum +
                  order.itemCount,
                0
              ) / totalOrders
            ).toFixed(2)
          );

              // -------------------------------------------------------------------------
    // Platform Analytics
    // -------------------------------------------------------------------------

    const platformMap = {};

    for (const order of orders) {
      if (!platformMap[order.platform]) {
        platformMap[order.platform] = {
          platform: order.platform,
          orders: 0,
          amount: 0,
        };
      }

      platformMap[order.platform].orders++;

      platformMap[order.platform].amount +=
        Number(order.amount);
    }

    // -------------------------------------------------------------------------
    // Payment Mode Analytics
    // -------------------------------------------------------------------------

    const paymentModeMap = {};

    for (const order of orders) {
      if (!paymentModeMap[order.paymentMode]) {
        paymentModeMap[order.paymentMode] = {
          paymentMode: order.paymentMode,
          orders: 0,
          amount: 0,
        };
      }

      paymentModeMap[order.paymentMode].orders++;

      paymentModeMap[order.paymentMode].amount +=
        Number(order.amount);
    }

    // -------------------------------------------------------------------------
    // Merchant Analytics
    // -------------------------------------------------------------------------

    const merchantSpend =
      await prisma.ecommerceOrder.groupBy({

        by: ["merchantId"],

        where: {
          userId,
          merchantId: {
            not: null,
          },
        },

        _sum: {
          amount: true,
        },

        _count: {
          merchantId: true,
        },

      });

    // -------------------------------------------------------------------------
    // Category Analytics
    // -------------------------------------------------------------------------

    const categorySpend =
      await prisma.ecommerceOrder.groupBy({

        by: ["categoryId"],

        where: {
          userId,
          categoryId: {
            not: null,
          },
        },

        _sum: {
          amount: true,
        },

        _count: {
          categoryId: true,
        },

      });

    return {

      totalOrders,

      totalSpend,

      averageOrderValue,

      largestOrder,

      smallestOrder,

      deliveredOrders,

      shippedOrders,

      pendingOrders,

      cancelledOrders,

      returnedOrders,

      refundedOrders,

      averageItemsPerOrder,

      returnRate:
        totalOrders === 0
          ? 0
          : Number(
              (
                (returnedOrders * 100) /
                totalOrders
              ).toFixed(2)
            ),

      refundRate:
        totalOrders === 0
          ? 0
          : Number(
              (
                (refundedOrders * 100) /
                totalOrders
              ).toFixed(2)
            ),

      platformBreakdown:
        Object.values(platformMap),

      paymentModeBreakdown:
        Object.values(paymentModeMap),

      merchantSpend,

      categorySpend,

    };
  }

  // ---------------------------------------------------------------------------
  // PRIVATE HELPERS
  // ---------------------------------------------------------------------------

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

  async _validateMerchant(
    userId,
    merchantId
  ) {

    const merchant =
      await prisma.merchant.findFirst({

        where: {
          id: merchantId,
          userId,
        },

      });

    if (!merchant) {
      throw new BadRequestError(
        "Merchant not found."
      );
    }
  }

  async _validateCategory(
    userId,
    categoryId
  ) {

    const category =
      await prisma.category.findFirst({

        where: {
          id: categoryId,
          userId,
        },

      });

    if (!category) {
      throw new BadRequestError(
        "Category not found."
      );
    }
  }

  _buildWhereClause(
    userId,
    query
  ) {

    const where = {
      userId,
    };

    if (query.platform) {
      where.platform = {
        contains: query.platform,
        mode: "insensitive",
      };
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.paymentMode) {
      where.paymentMode =
        query.paymentMode;
    }

    if (
      query.isReturned !== undefined
    ) {
      where.isReturned =
        query.isReturned === "true";
    }

    if (
      query.isRefunded !== undefined
    ) {
      where.isRefunded =
        query.isRefunded === "true";
    }

    if (
      query.startDate ||
      query.endDate
    ) {

      where.orderDate = {};

      if (query.startDate) {
        where.orderDate.gte =
          new Date(query.startDate);
      }

      if (query.endDate) {
        where.orderDate.lte =
          new Date(query.endDate);
      }
    }

    if (
      query.minAmount ||
      query.maxAmount
    ) {

      where.amount = {};

      if (query.minAmount) {
        where.amount.gte =
          Number(query.minAmount);
      }

      if (query.maxAmount) {
        where.amount.lte =
          Number(query.maxAmount);
      }
    }

    if (query.search) {

      where.OR = [

        {
          platform: {
            contains:
              query.search,
            mode:
              "insensitive",
          },
        },

        {
          orderId: {
            contains:
              query.search,
            mode:
              "insensitive",
          },
        },

      ];
    }

    return where;
  }

  _buildOrderBy(
    sortBy,
    order
  ) {

    const direction =
      order === "asc"
        ? "asc"
        : "desc";

    const map = {

      amount: "amount",

      orderDate:
        "orderDate",

      createdAt:
        "createdAt",

      itemCount:
        "itemCount",

      platform:
        "platform",

    };

    return {
      [map[sortBy] ||
      "orderDate"]:
        direction,
    };
  }

  _pickAllowedFields(
    data,
    allowedFields
  ) {

    const result = {};

    for (const field of allowedFields) {

      if (
        data[field] !== undefined
      ) {
        result[field] =
          data[field];
      }

    }

    return result;
  }

  async _findById(id) {

    return prisma.ecommerceOrder.findUnique({

      where: {
        id,
      },

      include:
        ECOMMERCE_ORDER_INCLUDE,

    });
  }
}

module.exports =
  new EcommerceOrderService();