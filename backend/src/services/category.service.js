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

const CATEGORY_INCLUDE = {

  parent: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },

  subcategories: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },

  _count: {

    select: {

      transactions: true,

      ecommerceOrders: true,

      subcategories: true,

    },

  },

};

// -----------------------------------------------------------------------------
// Allowed Fields
// -----------------------------------------------------------------------------

const ALLOWED_CREATE_FIELDS = [

  "name",

  "slug",

  "description",

  "icon",

  "color",

  "parentId",

];

const ALLOWED_UPDATE_FIELDS = [...ALLOWED_CREATE_FIELDS];

// -----------------------------------------------------------------------------
// Service
// -----------------------------------------------------------------------------

class CategoryService {

  // ---------------------------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------------------------

  async createCategory(
    data,
    context = {}
  ) {

    if (data.parentId) {
      await this._validateParent(
        data.parentId
      );
    }

    const safeData =
      this._pickAllowedFields(
        data,
        ALLOWED_CREATE_FIELDS
      );

    const category =
      await prisma.category.create({

        data: safeData,

        include:
          CATEGORY_INCLUDE,

      });

    await auditService.log({

      action:
        "CATEGORY_CREATE",

      description:
        `Category "${category.name}" created.`,

      ...context,

    });

    return category;
  }

  // ---------------------------------------------------------------------------
  // GET
  // ---------------------------------------------------------------------------

  async getCategory(id) {

    const category =
      await prisma.category.findUnique({

        where: {
          id,
        },

        include:
          CATEGORY_INCLUDE,

      });

    if (!category) {

      throw new NotFoundError(
        "Category not found."
      );

    }

    return category;
  }

  // ---------------------------------------------------------------------------
  // LIST
  // ---------------------------------------------------------------------------

  async listCategories(
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
        query
      );

    const orderBy =
      this._buildOrderBy(
        query.sortBy,
        query.order
      );

    const [total, categories] =
      await prisma.$transaction([

        prisma.category.count({
          where,
        }),

        prisma.category.findMany({

          where,

          include:
            CATEGORY_INCLUDE,

          orderBy,

          skip:
            (page - 1) * limit,

          take:
            limit,

        }),

      ]);

    return {

      categories,

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

  async updateCategory(
    categoryId,
    data,
    context = {}
  ) {

    const existing =
      await prisma.category.findUnique({

        where: {
          id: categoryId,
        },

      });

    if (!existing) {
      throw new NotFoundError(
        "Category not found."
      );
    }

    if (data.parentId) {

      if (data.parentId === categoryId) {
        throw new BadRequestError(
          "A category cannot be its own parent."
        );
      }

      await this._validateParent(
        data.parentId
      );
    }

    const safeData =
      this._pickAllowedFields(
        data,
        ALLOWED_UPDATE_FIELDS
      );

    const category =
      await prisma.category.update({

        where: {
          id: categoryId,
        },

        data: safeData,

        include:
          CATEGORY_INCLUDE,

      });

    await auditService.log({

      action:
        "CATEGORY_UPDATE",

      description:
        `Category "${category.name}" updated.`,

      ...context,

    });

    return category;
  }

  // ---------------------------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------------------------

  async deleteCategory(
    categoryId,
    context = {}
  ) {

    const category =
      await prisma.category.findUnique({

        where: {
          id: categoryId,
        },

        include: {

          _count: {

            select: {

              subcategories: true,

              transactions: true,

              ecommerceOrders: true,

            },

          },

        },

      });

    if (!category) {
      throw new NotFoundError(
        "Category not found."
      );
    }

    if (category._count.subcategories > 0) {
      throw new BadRequestError(
        "Cannot delete category with subcategories."
      );
    }

    if (category._count.transactions > 0) {
      throw new BadRequestError(
        "Cannot delete category linked to transactions."
      );
    }

    if (category._count.ecommerceOrders > 0) {
      throw new BadRequestError(
        "Cannot delete category linked to ecommerce orders."
      );
    }

    await prisma.category.delete({

      where: {
        id: categoryId,
      },

    });

    await auditService.log({

      action:
        "CATEGORY_DELETE",

      description:
        `Category "${category.name}" deleted.`,

      ...context,

    });

    return {
      success: true,
    };
  }

  // ---------------------------------------------------------------------------
  // STATISTICS
  // ---------------------------------------------------------------------------

  async getCategoryStatistics() {

    const categories =
      await prisma.category.findMany({

        include: {

          _count: {

            select: {

              transactions: true,

              ecommerceOrders: true,

              subcategories: true,

            },

          },

        },

      });

    const totalCategories =
      categories.length;

    const rootCategories =
      categories.filter(
        (c) => !c.parentId
      ).length;

    const childCategories =
      categories.filter(
        (c) => c.parentId
      ).length;

    const totalTransactions =
      categories.reduce(
        (sum, category) =>
          sum +
          category._count.transactions,
        0
      );

    const totalOrders =
      categories.reduce(
        (sum, category) =>
          sum +
          category._count.ecommerceOrders,
        0
      );

    const totalSubcategories =
      categories.reduce(
        (sum, category) =>
          sum +
          category._count.subcategories,
        0
      );

    const mostUsedCategories =
      [...categories]
        .sort(
          (a, b) =>
            (b._count.transactions +
              b._count.ecommerceOrders) -
            (a._count.transactions +
              a._count.ecommerceOrders)
        )
        .slice(0, 10)
        .map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          transactionCount:
            category._count.transactions,
          ecommerceOrderCount:
            category._count.ecommerceOrders,
          totalUsage:
            category._count.transactions +
            category._count.ecommerceOrders,
        }));

    return {

      totalCategories,

      rootCategories,

      childCategories,

      totalTransactions,

      totalOrders,

      totalSubcategories,

      mostUsedCategories,

    };
  }
    // ---------------------------------------------------------------------------
  // PRIVATE HELPERS
  // ---------------------------------------------------------------------------

  async _validateParent(parentId) {

    const parent =
      await prisma.category.findUnique({

        where: {
          id: parentId,
        },

      });

    if (!parent) {
      throw new BadRequestError(
        "Parent category not found."
      );
    }
  }

  _buildWhereClause(query) {

    const where = {};

    if (query.parentId) {
      where.parentId = query.parentId;
    }

    if (query.rootOnly === "true") {
      where.parentId = null;
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
          slug: {
            contains: query.search,
            mode: "insensitive",
          },
        },

        {
          description: {
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

    return prisma.category.findUnique({

      where: {
        id,
      },

      include: CATEGORY_INCLUDE,

    });

  }

}

module.exports = new CategoryService();