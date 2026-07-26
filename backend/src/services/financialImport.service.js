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

const FINANCIAL_IMPORT_INCLUDE = {

  _count: {

    select: {

      transactions: true,

      utilityBills: true,

      mobileRecharges: true,

      ecommerceOrders: true,

    },

  },

};

// -----------------------------------------------------------------------------
// Allowed Fields
// -----------------------------------------------------------------------------

const ALLOWED_CREATE_FIELDS = [

  "source",

  "fileName",

  "fileSize",

  "recordCount",

  "status",

  "errorMessage",

  "metadata",

];

const ALLOWED_UPDATE_FIELDS = [...ALLOWED_CREATE_FIELDS];

// -----------------------------------------------------------------------------
// Service
// -----------------------------------------------------------------------------

class FinancialImportService {

  // ---------------------------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------------------------

  async createFinancialImport(
    userId,
    data,
    context = {}
  ) {

    const safeData =
      this._pickAllowedFields(
        data,
        ALLOWED_CREATE_FIELDS
      );

    const financialImport =
      await prisma.$transaction(
        async (tx) => {

          return tx.financialImport.create({

            data: {

              ...safeData,

              userId,

            },

            include:
              FINANCIAL_IMPORT_INCLUDE,

          });

        }
      );

    await auditService.log({

      userId,

      action:
        "FINANCIAL_IMPORT_CREATE",

      description:
        `Financial import "${financialImport.id}" created from ${financialImport.source}.`,

      ...context,

    });

    return financialImport;
  }

  // ---------------------------------------------------------------------------
  // GET
  // ---------------------------------------------------------------------------

  async getFinancialImport(
    userId,
    importId
  ) {

    const financialImport =
      await prisma.financialImport.findFirst({

        where: {

          id: importId,

          userId,

        },

        include:
          FINANCIAL_IMPORT_INCLUDE,

      });

    if (!financialImport) {

      throw new NotFoundError(
        "Financial import not found."
      );

    }

    return financialImport;
  }

  // ---------------------------------------------------------------------------
  // LIST
  // ---------------------------------------------------------------------------

  async listFinancialImports(
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

    const [total, imports] =
      await prisma.$transaction([

        prisma.financialImport.count({

          where,

        }),

        prisma.financialImport.findMany({

          where,

          include:
            FINANCIAL_IMPORT_INCLUDE,

          orderBy,

          skip:
            (page - 1) * limit,

          take:
            limit,

        }),

      ]);

    return {

      imports,

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

  async updateFinancialImport(
    userId,
    importId,
    data,
    context = {}
  ) {

    const existing =
      await prisma.financialImport.findFirst({

        where: {
          id: importId,
          userId,
        },

      });

    if (!existing) {
      throw new NotFoundError(
        "Financial import not found."
      );
    }

    const safeData =
      this._pickAllowedFields(
        data,
        ALLOWED_UPDATE_FIELDS
      );

    const financialImport =
      await prisma.$transaction(
        async (tx) => {

          return tx.financialImport.update({

            where: {
              id: importId,
            },

            data: safeData,

            include:
              FINANCIAL_IMPORT_INCLUDE,

          });

        }
      );

    await auditService.log({

      userId,

      action:
        "FINANCIAL_IMPORT_UPDATE",

      description:
        `Financial import "${importId}" updated.`,

      ...context,

    });

    return financialImport;
  }

  // ---------------------------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------------------------

  async deleteFinancialImport(
    userId,
    importId,
    context = {}
  ) {

    const existing =
      await prisma.financialImport.findFirst({

        where: {
          id: importId,
          userId,
        },

      });

    if (!existing) {
      throw new NotFoundError(
        "Financial import not found."
      );
    }

    await prisma.financialImport.delete({

      where: {
        id: importId,
      },

    });

    await auditService.log({

      userId,

      action:
        "FINANCIAL_IMPORT_DELETE",

      description:
        `Financial import "${importId}" deleted.`,

      ...context,

    });

    return {
      success: true,
    };
  }

  // ---------------------------------------------------------------------------
  // STATISTICS
  // ---------------------------------------------------------------------------

  async getFinancialImportStatistics(
    userId
  ) {

    const imports =
      await prisma.financialImport.findMany({

        where: {
          userId,
        },

      });

    const totalImports =
      imports.length;

    const totalRecords =
      imports.reduce(
        (sum, item) =>
          sum + item.recordCount,
        0
      );

    const totalFileSize =
      imports.reduce(
        (sum, item) =>
          sum + (item.fileSize || 0),
        0
      );

    const averageRecordsPerImport =
      totalImports === 0
        ? 0
        : Number(
            (
              totalRecords /
              totalImports
            ).toFixed(2)
          );

    const pendingImports =
      imports.filter(
        (i) =>
          i.status ===
          "PENDING"
      ).length;

    const processingImports =
      imports.filter(
        (i) =>
          i.status ===
          "PROCESSING"
      ).length;

    const completedImports =
      imports.filter(
        (i) =>
          i.status ===
          "COMPLETED"
      ).length;

    const failedImports =
      imports.filter(
        (i) =>
          i.status ===
          "FAILED"
      ).length;

    const successRate =
      totalImports === 0
        ? 0
        : Number(
            (
              (completedImports *
                100) /
              totalImports
            ).toFixed(2)
          );

    // -------------------------------------------------------------------------
    // Source Analytics
    // -------------------------------------------------------------------------

    const sourceMap = {};

    for (const item of imports) {

      if (!sourceMap[item.source]) {

        sourceMap[item.source] = {

          source: item.source,

          imports: 0,

          records: 0,

        };

      }

      sourceMap[item.source]
        .imports++;

      sourceMap[item.source]
        .records +=
        item.recordCount;

    }

    // -------------------------------------------------------------------------
    // Monthly Imports
    // -------------------------------------------------------------------------

    const monthlyImports = {};

    for (const item of imports) {

      const month =
        item.importedAt
          .toISOString()
          .slice(0, 7);

      if (!monthlyImports[month]) {

        monthlyImports[month] = {

          month,

          imports: 0,

          records: 0,

        };

      }

      monthlyImports[month]
        .imports++;

      monthlyImports[month]
        .records +=
        item.recordCount;

    }

    return {

      totalImports,

      totalRecords,

      totalFileSize,

      averageRecordsPerImport,

      pendingImports,

      processingImports,

      completedImports,

      failedImports,

      successRate,

      sourceBreakdown:
        Object.values(
          sourceMap
        ),

      monthlyImports:
        Object.values(
          monthlyImports
        ),

    };
  }
    // ---------------------------------------------------------------------------
  // PRIVATE HELPERS
  // ---------------------------------------------------------------------------

  _buildWhereClause(userId, query) {

    const where = {
      userId,
    };

    if (query.source) {
      where.source = query.source;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.fileName) {
      where.fileName = {
        contains: query.fileName,
        mode: "insensitive",
      };
    }

    if (query.search) {

      where.OR = [

        {
          fileName: {
            contains: query.search,
            mode: "insensitive",
          },
        },

        {
          errorMessage: {
            contains: query.search,
            mode: "insensitive",
          },
        },

      ];

    }

    if (query.minRecords || query.maxRecords) {

      where.recordCount = {};

      if (query.minRecords) {
        where.recordCount.gte =
          Number(query.minRecords);
      }

      if (query.maxRecords) {
        where.recordCount.lte =
          Number(query.maxRecords);
      }

    }

    if (query.startDate || query.endDate) {

      where.importedAt = {};

      if (query.startDate) {
        where.importedAt.gte =
          new Date(query.startDate);
      }

      if (query.endDate) {
        where.importedAt.lte =
          new Date(query.endDate);
      }

    }

    return where;
  }

  _buildOrderBy(sortBy, order) {

    const direction =
      order === "asc"
        ? "asc"
        : "desc";

    const map = {

      importedAt:
        "importedAt",

      createdAt:
        "createdAt",

      fileSize:
        "fileSize",

      recordCount:
        "recordCount",

      source:
        "source",

      status:
        "status",

    };

    return {
      [map[sortBy] || "importedAt"]:
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

    return prisma.financialImport.findUnique({

      where: {
        id,
      },

      include:
        FINANCIAL_IMPORT_INCLUDE,

    });

  }

}

module.exports =
  new FinancialImportService();