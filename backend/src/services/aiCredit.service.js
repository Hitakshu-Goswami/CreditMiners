const prisma = require("../config/prisma");

const NotFoundError = require("../errors/NotFoundError");

class AICreditService {
  async analyzeLoan(userId, loanId) {
    const loan = await prisma.loanRequest.findFirst({
      where: {
        id: loanId,
        borrowerId: userId,
      },
    });

    if (!loan) {
      throw new NotFoundError("Loan request not found.");
    }

    let score = 700;

    // Amount
    if (Number(loan.amount) > 1000000) score -= 40;
    else if (Number(loan.amount) > 500000) score -= 20;

    // Duration
    if (loan.durationMonths > 60) score -= 30;
    else if (loan.durationMonths > 36) score -= 15;

    // Interest Rate
    if (loan.interestRate) {
      const rate = Number(loan.interestRate);

      if (rate <= 10) score += 20;
      else if (rate >= 20) score -= 20;
    }

    // Collateral
    const collateral = await prisma.loanMedia.count({
      where: {
        loanId,
        collateralType: {
          not: "NONE",
        },
      },
    });

    if (collateral > 0) {
      score += 35;
    }

    score = Math.max(300, Math.min(score, 850));

    let riskLevel = "LOW";

    if (score < 550)
      riskLevel = "HIGH";
    else if (score < 700)
      riskLevel = "MEDIUM";

    const recommendation =
      riskLevel === "LOW"
        ? "Recommended for funding."
        : riskLevel === "MEDIUM"
        ? "Fund with caution."
        : "High investment risk.";

    const summary =
      riskLevel === "LOW"
        ? "Strong financial indicators."
        : riskLevel === "MEDIUM"
        ? "Moderate repayment risk."
        : "Higher probability of repayment issues.";

    const confidence = 0.92;

    const updated = await prisma.loanRequest.update({
      where: {
        id: loanId,
      },
      data: {
        aiCreditScore: score,
        riskLevel,
        aiRecommendation: recommendation,
        aiSummary: summary,
        aiConfidence: confidence,
        aiLastEvaluatedAt: new Date(),
      },
    });

    return {
      score: updated.aiCreditScore,
      riskLevel: updated.riskLevel,
      confidence: updated.aiConfidence,
      recommendation: updated.aiRecommendation,
      summary: updated.aiSummary,
      evaluatedAt: updated.aiLastEvaluatedAt,
    };
  }

  async getAnalysis(userId, loanId) {
    const loan = await prisma.loanRequest.findFirst({
      where: {
        id: loanId,
        borrowerId: userId,
      },
      select: {
        aiCreditScore: true,
        riskLevel: true,
        aiRecommendation: true,
        aiSummary: true,
        aiConfidence: true,
        aiLastEvaluatedAt: true,
      },
    });

    if (!loan) {
      throw new NotFoundError("Loan request not found.");
    }

    return loan;
  }
}

module.exports = new AICreditService();