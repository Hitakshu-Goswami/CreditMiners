const prisma = require("../config/prisma");

const auditService = require("./audit.service");

const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const aiCreditService = require("./aiCredit.service");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const LOAN_INCLUDE = {
  borrower: {
    select: {
      id: true,
      fullName: true,
      profileImage: true,
      city: true,
      state: true,
      country: true,
    },
  },
};

class LoanService {
 async createLoan(userId, data, context = {}) {
  const loan = await prisma.loanRequest.create({
    data: {

        collateralType: data.collateralType,

collateralValue: data.collateralValue,

collateralDescription: data.collateralDescription,
      borrowerId: userId,

      // Existing fields
      ...data,

      // Financial
      interestRate: data.interestRate,
      minimumInvestment: data.minimumInvestment,

      fundingDeadline: data.fundingDeadline
        ? new Date(data.fundingDeadline)
        : null,

      expiryDate: data.expiryDate
        ? new Date(data.expiryDate)
        : null,

      // Location
      country: data.country,
      state: data.state,
      city: data.city,

      latitude: data.latitude,
      longitude: data.longitude,

      // Metadata
      lastActivityAt: new Date(),
    },
    include: LOAN_INCLUDE,
  });

  await auditService.log({
    userId,
    action: "LOAN_CREATED",
    description: `Loan request "${loan.title}" created.`,
    ...context,
  });

  return loan;
}

  async listMyLoans(userId, query = {}) {
    const page = Number(query.page || DEFAULT_PAGE);
    const limit = Math.min(
      Number(query.limit || DEFAULT_LIMIT),
      MAX_LIMIT
    );

    const where = {
      borrowerId: userId,
    };

    if (query.status) {
      where.status = query.status;
    }

    const [total, loans] = await prisma.$transaction([
      prisma.loanRequest.count({
        where,
      }),

      prisma.loanRequest.findMany({
        where,
        include: LOAN_INCLUDE,
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      loans,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getMyLoan(userId, loanId) {
    const loan = await prisma.loanRequest.findFirst({
      where: {
        id: loanId,
        borrowerId: userId,
      },
      include: LOAN_INCLUDE,
    });

    if (!loan) {
      throw new NotFoundError("Loan request not found.");
    }

    return loan;
  }

  async updateLoan(userId, loanId, data, context = {}) {
  const loan = await prisma.loanRequest.findFirst({
    where: {
      id: loanId,
      borrowerId: userId,
    },
  });

  if (!loan) {
    throw new NotFoundError("Loan request not found.");
  }

  if (loan.status !== "DRAFT") {
    throw new BadRequestError(
      "Only draft loan requests can be updated."
    );
  }

  const updatedLoan = await prisma.loanRequest.update({
    where: {
      id: loanId,
    },
    data: {
        collateralType: data.collateralType,

collateralValue: data.collateralValue,

collateralDescription: data.collateralDescription,
      ...data,
      

      // Financial
      interestRate: data.interestRate,
      minimumInvestment: data.minimumInvestment,

      fundingDeadline: data.fundingDeadline
        ? new Date(data.fundingDeadline)
        : undefined,

      expiryDate: data.expiryDate
        ? new Date(data.expiryDate)
        : undefined,

      // Location
      country: data.country,
      state: data.state,
      city: data.city,

      latitude: data.latitude,
      longitude: data.longitude,

      // Metadata
      lastActivityAt: new Date(),
    },
    include: LOAN_INCLUDE,
  });

  await auditService.log({
    userId,
    action: "LOAN_UPDATED",
    description: `Loan request "${updatedLoan.title}" updated.`,
    ...context,
  });

  return updatedLoan;
}

  async deleteDraftLoan(userId, loanId, context = {}) {
    const loan = await prisma.loanRequest.findFirst({
      where: {
        id: loanId,
        borrowerId: userId,
      },
    });

    if (!loan) {
      throw new NotFoundError("Loan request not found.");
    }

    if (loan.status !== "DRAFT") {
      throw new BadRequestError(
        "Only draft loan requests can be deleted."
      );
    }

    await prisma.loanRequest.delete({
      where: {
        id: loanId,
      },
    });

    await auditService.log({
      userId,
      action: "LOAN_DELETED",
      description: `Draft loan request "${loan.title}" deleted.`,
      ...context,
    });

    return {
      success: true,
    };
  }

  async verifyLoanOwnership(userId, loanId) {
    const loan = await prisma.loanRequest.findUnique({
      where: {
        id: loanId,
      },
    });

    if (!loan) {
      throw new NotFoundError("Loan request not found.");
    }

    if (loan.borrowerId !== userId) {
      throw new ForbiddenError(
        "You are not allowed to access this loan request."
      );
    }

    return loan;
  }
async publishLoan(userId, loanId, context = {}) {
  const loan = await this.verifyLoanOwnership(userId, loanId);

  if (loan.status !== "DRAFT") {
    throw new BadRequestError(
      "Only draft loan requests can be published."
    );
  }

  this.validateLoanForPublishing(loan);

  const updatedLoan = await prisma.loanRequest.update({
    where: {
      id: loanId,
    },
    data: {
      status: "PUBLISHED",
     publishedAt: new Date(),
lastActivityAt: new Date(),

viewCount: 0,
bookmarkCount: 0,
shareCount: 0,
trendingScore: 0,

fundingStatus: "OPEN",

...this.buildAIPlaceholders(),
    },
    include: LOAN_INCLUDE,
  });

await auditService.log({
  userId,
  action: "LOAN_PUBLISHED",
  description: `Loan request "${updatedLoan.title}" published.`,
  ...context,
});

// Automatically generate AI analysis
await aiCreditService.analyzeLoan(userId, loanId);

const finalLoan = await prisma.loanRequest.findUnique({
  where: {
    id: loanId,
  },
  include: LOAN_INCLUDE,
});

return finalLoan;
}

async closeLoan(userId, loanId, context = {}) {
  const loan = await this.verifyLoanOwnership(userId, loanId);

  if (!["PUBLISHED", "FUNDED"].includes(loan.status)) {
    throw new BadRequestError(
      "Only published or funded loan requests can be closed."
    );
  }

  const updatedLoan = await prisma.loanRequest.update({
    where: {
      id: loanId,
    },
    data: {
      status: "CLOSED",
      closedAt: new Date(),
      lastActivityAt: new Date(),

      // Final funding status
      fundingStatus: "EXPIRED",
    },
    include: LOAN_INCLUDE,
  });

  await auditService.log({
    userId,
    action: "LOAN_CLOSED",
    description: `Loan request "${updatedLoan.title}" closed.`,
    ...context,
  });

  return updatedLoan;
}

  async markLoanAsFunded(loanId, context = {}) {
    const loan = await prisma.loanRequest.findUnique({
      where: {
        id: loanId,
      },
    });

    if (!loan) {
      throw new NotFoundError("Loan request not found.");
    }

    if (loan.status !== "PUBLISHED") {
      throw new BadRequestError(
        "Only published loan requests can be marked as funded."
      );
    }

    const updatedLoan = await prisma.loanRequest.update({
      where: {
        id: loanId,
      },
      data: {
        status: "FUNDED",
        fundingProgress: 100,
      },
      include: LOAN_INCLUDE,
    });

    await auditService.log({
      userId: loan.borrowerId,
      action: "LOAN_FUNDED",
      description: `Loan request "${updatedLoan.title}" marked as funded.`,
      ...context,
    });

    return updatedLoan;
  }
async listPublishedLoans(query = {}) {
  const page = Number(query.page || DEFAULT_PAGE);
  const limit = Math.min(Number(query.limit || DEFAULT_LIMIT), MAX_LIMIT);

  const where = {
    status: "PUBLISHED",
  };

  // Category
  if (query.category) {
    where.category = query.category;
  }

  // Risk Level
  if (query.riskLevel) {
    where.riskLevel = query.riskLevel;
  }

  // Funding Status
  if (query.fundingStatus) {
    where.fundingStatus = query.fundingStatus;
  }

  // Country
  if (query.country) {
    where.country = {
      equals: query.country,
      mode: "insensitive",
    };
  }

  // State
  if (query.state) {
    where.state = {
      equals: query.state,
      mode: "insensitive",
    };
  }

  // City
  if (query.city) {
    where.city = {
      equals: query.city,
      mode: "insensitive",
    };
  }

  // Amount Range
  if (query.minAmount || query.maxAmount) {
    where.amount = {};

    if (query.minAmount)
      where.amount.gte = Number(query.minAmount);

    if (query.maxAmount)
      where.amount.lte = Number(query.maxAmount);
  }

  // Interest Rate Range
  if (query.minInterest || query.maxInterest) {
    where.interestRate = {};

    if (query.minInterest)
      where.interestRate.gte = Number(query.minInterest);

    if (query.maxInterest)
      where.interestRate.lte = Number(query.maxInterest);
  }

  // Duration Range
  if (query.minDuration || query.maxDuration) {
    where.durationMonths = {};

    if (query.minDuration)
      where.durationMonths.gte = Number(query.minDuration);

    if (query.maxDuration)
      where.durationMonths.lte = Number(query.maxDuration);
  }

  // Keyword Search
  if (query.search) {
    where.OR = [
      {
        title: {
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
      {
        purpose: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  const sortField = this.getAllowedSortField(query.sortBy);

const sortOrder =
  query.sortBy === "oldest" ? "asc" : query.order === "asc" ? "asc" : "desc";

  const [total, loans] = await prisma.$transaction([
    prisma.loanRequest.count({
      where,
    }),

    prisma.loanRequest.findMany({
      where,
      include: LOAN_INCLUDE,
      orderBy: {
        [sortField]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return {
    loans,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
 async getPublishedLoan(loanId) {
  const loan = await prisma.loanRequest.findFirst({
    where: {
      id: loanId,
      status: "PUBLISHED",
    },
    include: LOAN_INCLUDE,
  });

  if (!loan) {
    throw new NotFoundError("Loan request not found.");
  }

  const interestCount = await prisma.loanInterest.count({
    where: {
      loanId,
    },
  });

  const updatedLoan = await prisma.loanRequest.update({
    where: {
      id: loanId,
    },
    data: {
      viewCount: {
        increment: 1,
      },

      trendingScore:
        loan.viewCount +
        1 +
        (loan.bookmarkCount * 5) +
        (loan.shareCount * 8) +
        (interestCount * 10),

      lastActivityAt: new Date(),
    },
    include: LOAN_INCLUDE,
  });

  return updatedLoan;
}

  async getLoanStatistics(userId) {
    const [
      totalLoans,
      draftLoans,
      publishedLoans,
      fundedLoans,
      closedLoans,
    ] = await Promise.all([
      prisma.loanRequest.count({
        where: {
          borrowerId: userId,
        },
      }),

      prisma.loanRequest.count({
        where: {
          borrowerId: userId,
          status: "DRAFT",
        },
      }),

      prisma.loanRequest.count({
        where: {
          borrowerId: userId,
          status: "PUBLISHED",
        },
      }),

      prisma.loanRequest.count({
        where: {
          borrowerId: userId,
          status: "FUNDED",
        },
      }),

      prisma.loanRequest.count({
        where: {
          borrowerId: userId,
          status: "CLOSED",
        },
      }),
    ]);

    return {
      totalLoans,
      draftLoans,
      publishedLoans,
      fundedLoans,
      closedLoans,
    };
  }
 getAllowedSortField(sortBy) {
  const allowedSortFields = {
    latest: "publishedAt",
    oldest: "publishedAt",

    amount: "amount",
    interest: "interestRate",
    duration: "durationMonths",

    views: "viewCount",
    trending: "trendingScore",

    title: "title",

    createdAt: "createdAt",
    publishedAt: "publishedAt",
  };

  return allowedSortFields[sortBy] || "publishedAt";
}
  validateLoanForPublishing(loan) {
    if (!loan.title)
      throw new BadRequestError("Loan title is required.");

    if (!loan.amount)
      throw new BadRequestError("Loan amount is required.");

    if (!loan.durationMonths)
      throw new BadRequestError("Loan duration is required.");

    if (!loan.category)
      throw new BadRequestError("Loan category is required.");

    if (!loan.purpose)
      throw new BadRequestError("Loan purpose is required.");
  }

  buildAIPlaceholders() {
    return {
      aiCreditScore: null,
      riskLevel: null,
      verificationStatus: "PENDING",
      fundingProgress: 0,
    };
  }
  async getTrendingLoans(limit = 10) {
  return prisma.loanRequest.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: LOAN_INCLUDE,
    orderBy: [
      {
        trendingScore: "desc",
      },
      {
        viewCount: "desc",
      },
      {
        publishedAt: "desc",
      },
    ],
    take: Number(limit),
  });
}async getRecommendedLoans(limit = 10) {
  return prisma.loanRequest.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: LOAN_INCLUDE,
    orderBy: [
      {
        interestRate: "desc",
      },
      {
        riskLevel: "asc",
      },
      {
        publishedAt: "desc",
      },
    ],
    take: Number(limit),
  });
}
async getFeaturedLoans(limit = 10) {
  return prisma.loanRequest.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: LOAN_INCLUDE,
    orderBy: [
      {
        publishedAt: "desc",
      },
    ],
    take: Number(limit),
  });
}

}



module.exports = new LoanService();

