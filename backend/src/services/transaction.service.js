const prisma = require("../config/prisma");

const auditService = require("./audit.service");

const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

// ---------------------------------------------------------------------------
// Shared include — all relations returned with every transaction response
// ---------------------------------------------------------------------------

const TRANSACTION_INCLUDE = {
  category: {
    select: {
      id: true,
      name: true,
      transactionType: true,
      icon: true,
      color: true,
    },
  },
  merchantRef: {
    select: {
      id: true,
      name: true,
      category: true,
      logoUrl: true,
      isVerified: true,
    },
  },
  categoryRef: {
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      color: true,
    },
  },
  transactionTags: {
    select: {
      id: true,
      tag: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Allowed fields for mass-assignment prevention
// ---------------------------------------------------------------------------

const ALLOWED_CREATE_FIELDS = [
  "amount",
  "transactionType",
  "paymentMethod",
  "categoryId",
  "transactionDate",
  "description",
  "merchant",
  "merchantId",
  "categoryRefId",
  "location",
  "referenceNumber",
  "isRecurring",
  "receiptUrl",
];

const ALLOWED_UPDATE_FIELDS = [...ALLOWED_CREATE_FIELDS];

// ---------------------------------------------------------------------------
// TransactionService
// ---------------------------------------------------------------------------

class TransactionService {
  // -----------------------------------------------------------------------
  // CREATE
  // -----------------------------------------------------------------------

  async createTransaction(userId, data, context = {}) {
    // Validate TransactionCategory existence
    const category = await prisma.transactionCategory.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new BadRequestError("Transaction category not found.");
    }

    // Validate Category (shared) existence if provided
    if (data.categoryRefId) {
      const categoryRef = await prisma.category.findUnique({
        where: { id: data.categoryRefId },
      });

      if (!categoryRef) {
        throw new BadRequestError("Category not found.");
      }
    }

    // Merchant resolution — link existing or auto-create
    let merchantId = data.merchantId || null;

    if (!merchantId && data.merchant) {
      merchantId = await this._resolveOrCreateMerchant(data.merchant);
    }

    if (merchantId) {
      const merchantExists = await prisma.merchant.findUnique({
        where: { id: merchantId },
      });

      if (!merchantExists) {
        throw new BadRequestError("Merchant not found.");
      }
    }

    // Build safe data (mass-assignment prevention)
    const safeData = this._pickAllowedFields(data, ALLOWED_CREATE_FIELDS);

    const transaction = await prisma.transaction.create({
      data: {
        ...safeData,
        userId,
        merchantId,
        transactionDate: new Date(data.transactionDate),
      },
      include: TRANSACTION_INCLUDE,
    });

    // Tag assignment
    if (data.tagIds && data.tagIds.length > 0) {
      await this._syncTags(transaction.id, data.tagIds);
    }

    // Re-fetch with tags
    const result = await this._findById(transaction.id);

    await auditService.log({
      userId,
      action: "TRANSACTION_CREATE",
      description: `Transaction "${transaction.id}" created — ${data.transactionType} ₹${data.amount}.`,
      ...context,
    });

    return result;
  }

  // -----------------------------------------------------------------------
  // GET BY ID (ownership enforced)
  // -----------------------------------------------------------------------

  async getTransaction(userId, transactionId) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
      include: TRANSACTION_INCLUDE,
    });

    if (!transaction) {
      throw new NotFoundError("Transaction not found.");
    }

    return transaction;
  }

  // -----------------------------------------------------------------------
  // UPDATE
  // -----------------------------------------------------------------------

  async updateTransaction(userId, transactionId, data, context = {}) {
    const existing = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError("Transaction not found.");
    }

    // Validate category if being changed
    if (data.categoryId) {
      const category = await prisma.transactionCategory.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new BadRequestError("Transaction category not found.");
      }
    }

    // Validate shared Category if being changed
    if (data.categoryRefId) {
      const categoryRef = await prisma.category.findUnique({
        where: { id: data.categoryRefId },
      });

      if (!categoryRef) {
        throw new BadRequestError("Category not found.");
      }
    }

    // Merchant resolution
    let merchantId = data.merchantId !== undefined ? data.merchantId : undefined;

    if (merchantId === undefined && data.merchant) {
      merchantId = await this._resolveOrCreateMerchant(data.merchant);
    }

    if (merchantId) {
      const merchantExists = await prisma.merchant.findUnique({
        where: { id: merchantId },
      });

      if (!merchantExists) {
        throw new BadRequestError("Merchant not found.");
      }
    }

    // Build safe data
    const safeData = this._pickAllowedFields(data, ALLOWED_UPDATE_FIELDS);

    if (data.transactionDate) {
      safeData.transactionDate = new Date(data.transactionDate);
    }

    if (merchantId !== undefined) {
      safeData.merchantId = merchantId;
    }

    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: safeData,
      include: TRANSACTION_INCLUDE,
    });

    // Tag sync if tagIds provided
    if (data.tagIds !== undefined) {
      await this._syncTags(transaction.id, data.tagIds);
    }

    const result = await this._findById(transaction.id);

    await auditService.log({
      userId,
      action: "TRANSACTION_UPDATE",
      description: `Transaction "${transactionId}" updated.`,
      ...context,
    });

    return result;
  }

  // -----------------------------------------------------------------------
  // DELETE
  // -----------------------------------------------------------------------

  async deleteTransaction(userId, transactionId, context = {}) {
    const existing = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError("Transaction not found.");
    }

    // TransactionTag records cascade via onDelete: Cascade in schema
    await prisma.transaction.delete({
      where: { id: transactionId },
    });

    await auditService.log({
      userId,
      action: "TRANSACTION_DELETE",
      description: `Transaction "${transactionId}" deleted — ${existing.transactionType} ₹${existing.amount}.`,
      ...context,
    });

    return { success: true };
  }

  // -----------------------------------------------------------------------
  // LIST (with filtering, sorting, pagination)
  // -----------------------------------------------------------------------

  async listTransactions(userId, query = {}) {
    const page = Number(query.page || DEFAULT_PAGE);
    const limit = Math.min(
      Number(query.limit || DEFAULT_LIMIT),
      MAX_LIMIT
    );

    const where = { userId };

    // --- Type filter ---
    if (query.type) {
      where.transactionType = query.type;
    }

    // --- Payment method filter ---
    if (query.paymentMethod) {
      where.paymentMethod = query.paymentMethod;
    }

    // --- Category filters ---
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.categoryRefId) {
      where.categoryRefId = query.categoryRefId;
    }

    // --- Merchant filter ---
    if (query.merchantId) {
      where.merchantId = query.merchantId;
    }

    // --- Financial source filter (through import) ---
    if (query.source) {
      where.import = {
        source: query.source,
      };
    }

    // --- Date range ---
    if (query.startDate || query.endDate) {
      where.transactionDate = {};

      if (query.startDate) {
        where.transactionDate.gte = new Date(query.startDate);
      }

      if (query.endDate) {
        where.transactionDate.lte = new Date(query.endDate);
      }
    }

    // --- Amount range ---
    if (query.minAmount || query.maxAmount) {
      where.amount = {};

      if (query.minAmount) {
        where.amount.gte = Number(query.minAmount);
      }

      if (query.maxAmount) {
        where.amount.lte = Number(query.maxAmount);
      }
    }

    // --- Search (description, merchant, referenceNumber) ---
    if (query.search) {
      where.OR = [
        {
          description: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          merchant: {
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

    // --- Sorting ---
    const orderBy = this._buildOrderBy(query.sortBy, query.order);

    const [total, transactions] = await prisma.$transaction([
      prisma.transaction.count({ where }),

      prisma.transaction.findMany({
        where,
        include: TRANSACTION_INCLUDE,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // -----------------------------------------------------------------------
  // Private helpers
  // -----------------------------------------------------------------------

  /**
   * Resolve a merchant by name — returns existing id or creates a new one.
   * Prevents duplicate merchants by using case-insensitive lookup.
   */
  async _resolveOrCreateMerchant(merchantName) {
    const trimmed = merchantName.trim();

    // Try to find an existing merchant (case-insensitive)
    const existing = await prisma.merchant.findFirst({
      where: {
        name: {
          equals: trimmed,
          mode: "insensitive",
        },
      },
    });

    if (existing) {
      return existing.id;
    }

    // Auto-create a new merchant
    const created = await prisma.merchant.create({
      data: { name: trimmed },
    });

    return created.id;
  }

  /**
   * Sync tags for a transaction:
   * 1. Remove all existing TransactionTag links.
   * 2. Re-create only the provided tag IDs (skips non-existent tags).
   * Prevents duplicate assignments via the @@unique constraint.
   */
  async _syncTags(transactionId, tagIds) {
    // Remove existing links
    await prisma.transactionTag.deleteMany({
      where: { transactionId },
    });

    if (!tagIds || tagIds.length === 0) return;

    // Validate that all provided tags exist
    const existingTags = await prisma.tag.findMany({
      where: {
        id: { in: tagIds },
      },
      select: { id: true },
    });

    const validIds = existingTags.map((t) => t.id);

    if (validIds.length === 0) return;

    // Deduplicate
    const uniqueIds = [...new Set(validIds)];

    await prisma.transactionTag.createMany({
      data: uniqueIds.map((tagId) => ({
        transactionId,
        tagId,
      })),
      skipDuplicates: true,
    });
  }

  /**
   * Pick only allowed fields from input to prevent mass-assignment.
   */
  _pickAllowedFields(data, allowedFields) {
    const result = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        result[field] = data[field];
      }
    }

    return result;
  }

  /**
   * Build Prisma orderBy clause from sortBy + order query params.
   */
  _buildOrderBy(sortBy, order) {
    const direction = order === "asc" ? "asc" : "desc";

    const sortMap = {
      date: "transactionDate",
      amount: "amount",
      createdAt: "createdAt",
    };

    const field = sortMap[sortBy] || "transactionDate";

    return { [field]: direction };
  }

  /**
   * Internal fetch by ID with full includes.
   */
  async _findById(transactionId) {
    return prisma.transaction.findUnique({
      where: { id: transactionId },
      include: TRANSACTION_INCLUDE,
    });
  }
}

module.exports = new TransactionService();
