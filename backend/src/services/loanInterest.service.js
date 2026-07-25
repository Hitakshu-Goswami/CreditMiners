const prisma = require("../config/prisma");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

class LoanInterestService {

async createInterest(userId, loanId, data) {
  const loan = await prisma.loanRequest.findUnique({
    where: { id: loanId },
  });

  if (!loan || loan.status !== "PUBLISHED") {
    throw new NotFoundError("Loan not found.");
  }

  const exists = await prisma.loanInterest.findUnique({
    where: {
      loanId_investorId: {
        loanId,
        investorId: userId,
      },
    },
  });

  if (exists) {
    throw new BadRequestError("Interest already submitted.");
  }

  const interest = await prisma.loanInterest.create({
    data: {
      loanId,
      investorId: userId,
      amountOffered: data.amountOffered,
      message: data.message,
    },
  });

  const interestCount = await prisma.loanInterest.count({
    where: {
      loanId,
    },
  });

  await prisma.loanRequest.update({
    where: {
      id: loanId,
    },
    data: {
      trendingScore:
        loan.viewCount +
        (loan.bookmarkCount * 5) +
        (loan.shareCount * 8) +
        (interestCount * 10),

      lastActivityAt: new Date(),
    },
  });

  return interest;
}

  async getLoanInterests(userId, loanId) {

    const loan = await prisma.loanRequest.findFirst({
      where: {
        id: loanId,
        borrowerId: userId,
      },
    });

    if (!loan)
      throw new NotFoundError("Loan not found.");

    return prisma.loanInterest.findMany({
      where: { loanId },
      include: {
        investor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async acceptInterest(userId, interestId) {
  const interest = await prisma.loanInterest.findFirst({
    where: {
      id: interestId,
      loan: {
        borrowerId: userId,
      },
    },
  });

  if (!interest) {
    throw new NotFoundError("Interest not found.");
  }

  const updatedInterest = await prisma.loanInterest.update({
    where: {
      id: interestId,
    },
    data: {
      status: "ACCEPTED",
    },
  });

  const loan = await prisma.loanRequest.findUnique({
    where: {
      id: interest.loanId,
    },
  });

  const interestCount = await prisma.loanInterest.count({
    where: {
      loanId: interest.loanId,
    },
  });

  await prisma.loanRequest.update({
    where: {
      id: interest.loanId,
    },
    data: {
      trendingScore:
        loan.viewCount +
        (loan.bookmarkCount * 5) +
        (loan.shareCount * 8) +
        (interestCount * 10),

      lastActivityAt: new Date(),
    },
  });

  return updatedInterest;
}

  async rejectInterest(userId, interestId) {

    const interest = await prisma.loanInterest.findFirst({
      where: {
        id: interestId,
        loan: {
          borrowerId: userId,
        },
      },
    });

    if (!interest)
      throw new NotFoundError("Interest not found.");

    return prisma.loanInterest.update({
      where: { id: interestId },
      data: {
        status: "REJECTED",
      },
    });
  }

  async withdrawInterest(userId, interestId) {

    const interest = await prisma.loanInterest.findFirst({
      where: {
        id: interestId,
        investorId: userId,
      },
    });

    if (!interest)
      throw new NotFoundError("Interest not found.");

    const loanId = interest.loanId;

await prisma.loanInterest.delete({
  where: { id: interestId },
});

const loan = await prisma.loanRequest.findUnique({
  where: {
    id: loanId,
  },
});

const interestCount = await prisma.loanInterest.count({
  where: {
    loanId,
  },
});

await prisma.loanRequest.update({
  where: {
    id: loanId,
  },
  data: {
    trendingScore:
      loan.viewCount +
      (loan.bookmarkCount * 5) +
      (loan.shareCount * 8) +
      (interestCount * 10),

    lastActivityAt: new Date(),
  },
});

return { success: true };
  }

}

module.exports = new LoanInterestService();