const {
  assessmentDomains,
  DOMAIN_TYPES,
} = require("../constants/assessmentDomains");

class DomainEngine {
  getAllDomains() {
    return assessmentDomains
      .filter((domain) => domain.active)
      .sort((a, b) => a.order - b.order);
  }

  getDomain(key) {
    return this.getAllDomains().find(
      (domain) => domain.key === key
    );
  }

  buildProfile(answers = {}) {
    const profile = {};

    this.getAllDomains().forEach((domain) => {
      profile[domain.key] =
        this.evaluateDomain(
          domain,
          answers
        );
    });

    return profile;
  }

  evaluateDomain(domain, answers) {
    const domainAnswers = {};

    domain.questionKeys.forEach((questionKey) => {
      if (
        Object.prototype.hasOwnProperty.call(
          answers,
          questionKey
        )
      ) {
        domainAnswers[questionKey] =
          answers[questionKey];
      }
    });

    return {
      domain: domain.key,

      title: domain.title,

      description:
        domain.description,

      output: domain.output,

      weight: domain.weight,

      completion: this.calculateCompletion(
        domain,
        domainAnswers
      ),

      answerCount:
        Object.keys(domainAnswers)
          .length,

      totalQuestions:
        domain.questionKeys.length,

      answers: domainAnswers,

      result:
        this.generateResult(
          domain,
          domainAnswers
        ),
    };
  }

  calculateCompletion(
    domain,
    answers
  ) {
    if (
      domain.questionKeys.length === 0
    ) {
      return 0;
    }

    return Number(
      (
        (Object.keys(answers).length /
          domain.questionKeys.length) *
        100
      ).toFixed(2)
    );
  }

  generateResult(
    domain,
    answers
  ) {
    switch (domain.key) {
      case DOMAIN_TYPES.FINANCIAL_GOALS:
        return this.evaluateGoals(
          answers
        );

      case DOMAIN_TYPES.INVESTMENT_CAPACITY:
        return this.evaluateInvestmentCapacity(
          answers
        );

      case DOMAIN_TYPES.RISK_APPETITE:
        return this.evaluateRiskAppetite(
          answers
        );

      case DOMAIN_TYPES.TIME_HORIZON:
        return this.evaluateTimeHorizon(
          answers
        );

      case DOMAIN_TYPES.INCOME_STABILITY:
        return this.evaluateIncomeStability(
          answers
        );

      case DOMAIN_TYPES.FINANCIAL_EXPERIENCE:
        return this.evaluateFinancialExperience(
          answers
        );

      case DOMAIN_TYPES.FINANCIAL_BEHAVIOUR:
        return this.evaluateBehaviour(
          answers
        );

      default:
        return null;
    }
  }

  evaluateGoals(answers) {
    return {
      primaryGoal:
        answers.primary_investment_goal ||
        null,

      secondaryGoals:
        answers.secondary_goals || [],

      goalHierarchy: [
        answers.primary_investment_goal,
        ...(answers.secondary_goals ||
          []),
      ].filter(Boolean),
    };
  }

  evaluateInvestmentCapacity(
    answers
  ) {
    return {
      monthlyInvestmentBudget:
        answers.monthly_investment_budget ||
        0,

      disposableIncome:
        answers.disposable_income ||
        0,

      monthlySavings:
        answers.monthly_savings ||
        0,
    };
  }

  evaluateRiskAppetite(
    answers
  ) {
    return {
      lossTolerance:
        answers.loss_tolerance ??
        null,

      expectedReturn:
        answers.expected_return ??
        null,

      marketReaction:
        answers.market_reaction ??
        null,

      volatilityComfort:
        answers.volatility_comfort ??
        null,
    };
  }

  evaluateTimeHorizon(
    answers
  ) {
    return {
      investmentDuration:
        answers.investment_duration ??
        null,

      goalDeadline:
        answers.goal_deadline ??
        null,

      liquidityRequirement:
        answers.liquidity_requirement ??
        null,
    };
  }

  evaluateIncomeStability(
    answers
  ) {
    return {
      employmentStatus:
        answers.employment_status ??
        null,

      employmentType:
        answers.employment_type ??
        null,

      salaryGrowthExpectation:
        answers.salary_growth_expectation ??
        null,

      businessStability:
        answers.business_stability ??
        null,

      freelanceIncomePredictability:
        answers.freelance_income_predictability ??
        null,
    };
  }

  evaluateFinancialExperience(
    answers
  ) {
    return {
      investmentExperience:
        answers.investment_experience ??
        null,

      mutualFunds:
        answers.mutual_funds_experience ??
        null,

      stocks:
        answers.stocks_experience ??
        null,

      sip:
        answers.sip_experience ??
        null,

      gold:
        answers.gold_investment ??
        null,

      crypto:
        answers.crypto_investment ??
        null,

      fixedDeposits:
        answers.fixed_deposit_experience ??
        null,
    };
  }

  evaluateBehaviour(
    answers
  ) {
    return {
      panicSelling:
        answers.panic_selling ??
        null,

      savingHabit:
        answers.saving_habit ??
        null,

      budgetingHabit:
        answers.budgeting_habit ??
        null,

      financialPlanning:
        answers.financial_planning ??
        null,

      missedEmiLastYear:
        answers.missed_emi_last_year ??
        null,
    };
  }
}

module.exports = new DomainEngine();