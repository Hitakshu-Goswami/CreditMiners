const prisma = require("../config/prisma");

class DashboardService {
  async getBorrowerDashboard(userId) {
    const [
      totalLoans,
      draftLoans,
      publishedLoans,
      fundedLoans,
      closedLoans,
      loanStats,
      interestCount,
      aiStats,
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

      prisma.loanRequest.aggregate({
        where: {
          borrowerId: userId,
        },
        _sum: {
          viewCount: true,
        },
      }),

      prisma.loanInterest.count({
        where: {
          loan: {
            borrowerId: userId,
          },
        },
      }),

      prisma.loanRequest.aggregate({
        where: {
          borrowerId: userId,
          aiCreditScore: {
            not: null,
          },
        },
        _avg: {
          aiCreditScore: true,
        },
      }),
    ]);

    return {
      totalLoans,
      draftLoans,
      publishedLoans,
      fundedLoans,
      closedLoans,

      totalViews: loanStats._sum.viewCount || 0,

      totalInterestedInvestors: interestCount,

      averageAIScore: aiStats._avg.aiCreditScore
        ? Number(aiStats._avg.aiCreditScore).toFixed(0)
        : 0,
    };
  }

  async getMarketplaceDashboard() {
    const [
      activeLoans,
      fundedLoans,
      borrowers,
      investors,
      loanStats,
    ] = await Promise.all([
      prisma.loanRequest.count({
        where: {
          status: "PUBLISHED",
        },
      }),

      prisma.loanRequest.count({
        where: {
          status: "FUNDED",
        },
      }),

      prisma.loanRequest.groupBy({
        by: ["borrowerId"],
      }),

      prisma.loanInterest.groupBy({
        by: ["investorId"],
      }),

      prisma.loanRequest.aggregate({
        where: {
          status: "PUBLISHED",
        },
        _avg: {
          amount: true,
          interestRate: true,
        },
      }),
    ]);

    return {
      activeLoans,

      fundedLoans,

      totalBorrowers: borrowers.length,

      totalInvestors: investors.length,

      averageLoanAmount:
        loanStats._avg.amount || 0,

      averageInterestRate:
        loanStats._avg.interestRate || 0,
    };
  }

  async getInvestorDashboard(userId) {
    const [
      interestsSent,
      accepted,
      rejected,
      pending,
    ] = await Promise.all([
      prisma.loanInterest.count({
        where: {
          investorId: userId,
        },
      }),

      prisma.loanInterest.count({
        where: {
          investorId: userId,
          status: "ACCEPTED",
        },
      }),

      prisma.loanInterest.count({
        where: {
          investorId: userId,
          status: "REJECTED",
        },
      }),

      prisma.loanInterest.count({
        where: {
          investorId: userId,
          status: "PENDING",
        },
      }),
    ]);

    return {
      interestsSent,
      accepted,
      rejected,
      pending,
    };
  }
}

module.exports = new DashboardService();