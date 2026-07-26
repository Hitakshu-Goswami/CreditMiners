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

const TAG_INCLUDE = {

  _count: {

    select: {

      transactionTags: true,

    },

  },

};

// -----------------------------------------------------------------------------
// Allowed Fields
// -----------------------------------------------------------------------------

const ALLOWED_CREATE_FIELDS = [

  "name",

  "color",

];

const ALLOWED_UPDATE_FIELDS = [...ALLOWED_CREATE_FIELDS];

// -----------------------------------------------------------------------------
// Service
// -----------------------------------------------------------------------------

class TagService {

  // ---------------------------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------------------------

  async createTag(
    data,
    context = {}
  ) {

    const safeData =
      this._pickAllowedFields(
        data,
        ALLOWED_CREATE_FIELDS
      );

    const tag =
      await prisma.tag.create({

        data: safeData,

        include: TAG_INCLUDE,

      });

    await auditService.log({

      action: "TAG_CREATE",

      description:
        `Tag "${tag.name}" created.`,

      ...context,

    });

    return tag;

  }

  // ---------------------------------------------------------------------------
  // GET
  // ---------------------------------------------------------------------------

  async getTag(id) {

    const tag =
      await prisma.tag.findUnique({

        where: {
          id,
        },

        include: TAG_INCLUDE,

      });

    if (!tag) {

      throw new NotFoundError(
        "Tag not found."
      );

    }

    return tag;

  }

  // ---------------------------------------------------------------------------
  // LIST
  // ---------------------------------------------------------------------------

  async listTags(
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

    const [total, tags] =
      await prisma.$transaction([

        prisma.tag.count({

          where,

        }),

        prisma.tag.findMany({

          where,

          include: TAG_INCLUDE,

          orderBy,

          skip:
            (page - 1) * limit,

          take:
            limit,

        }),

      ]);

    return {

      tags,

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

  async updateTag(
    tagId,
    data,
    context = {}
  ) {

    const existing =
      await prisma.tag.findUnique({

        where: {
          id: tagId,
        },

      });

    if (!existing) {
      throw new NotFoundError(
        "Tag not found."
      );
    }

    const safeData =
      this._pickAllowedFields(
        data,
        ALLOWED_UPDATE_FIELDS
      );

    const tag =
      await prisma.tag.update({

        where: {
          id: tagId,
        },

        data: safeData,

        include: TAG_INCLUDE,

      });

    await auditService.log({

      action: "TAG_UPDATE",

      description:
        `Tag "${tag.name}" updated.`,

      ...context,

    });

    return tag;

  }

  // ---------------------------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------------------------

  async deleteTag(
    tagId,
    context = {}
  ) {

    const tag =
      await prisma.tag.findUnique({

        where: {
          id: tagId,
        },

        include: {

          _count: {

            select: {

              transactionTags: true,

            },

          },

        },

      });

    if (!tag) {

      throw new NotFoundError(
        "Tag not found."
      );

    }

    if (tag._count.transactionTags > 0) {

      throw new BadRequestError(

        "Cannot delete a tag that is assigned to transactions."

      );

    }

    await prisma.tag.delete({

      where: {
        id: tagId,
      },

    });

    await auditService.log({

      action: "TAG_DELETE",

      description:
        `Tag "${tag.name}" deleted.`,

      ...context,

    });

    return {
      success: true,
    };

  }

  // ---------------------------------------------------------------------------
  // STATISTICS
  // ---------------------------------------------------------------------------

  async getTagStatistics() {

    const tags =
      await prisma.tag.findMany({

        include: {

          _count: {

            select: {

              transactionTags: true,

            },

          },

        },

      });

    const totalTags =
      tags.length;

    const totalAssignments =
      tags.reduce(

        (sum, tag) =>
          sum +
          tag._count.transactionTags,

        0

      );

    const averageAssignments =
      totalTags === 0
        ? 0
        : Number(
            (
              totalAssignments /
              totalTags
            ).toFixed(2)
          );

    const unusedTags =
      tags.filter(

        tag =>
          tag._count.transactionTags === 0

      ).length;

    const usedTags =
      totalTags - unusedTags;

    const mostUsedTags =
      [...tags]

        .sort(

          (a, b) =>

            b._count.transactionTags -

            a._count.transactionTags

        )

        .slice(0, 10)

        .map(tag => ({

          id: tag.id,

          name: tag.name,

          color: tag.color,

          usageCount:
            tag._count.transactionTags,

        }));

    return {

      totalTags,

      usedTags,

      unusedTags,

      totalAssignments,

      averageAssignments,

      mostUsedTags,

    };

  }
    // ---------------------------------------------------------------------------
  // PRIVATE HELPERS
  // ---------------------------------------------------------------------------

  _buildWhereClause(query) {

    const where = {};

    if (query.search) {

      where.OR = [

        {
          name: {
            contains: query.search,
            mode: "insensitive",
          },
        },

        {
          color: {
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

      color: "color",

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

    return prisma.tag.findUnique({

      where: {
        id,
      },

      include: TAG_INCLUDE,

    });

  }

}

module.exports = new TagService();