const {
  GOAL_TYPES,
  GOAL_CATEGORIES,
  GOAL_PRIORITY,
  GOAL_HORIZON,
  GOAL_STATUS,
  GOAL_EXTRACTION_SOURCE,
  HORIZON_THRESHOLDS,
  GOAL_KEYWORDS,
} = require("../constants/goalExtraction.constants");

class GoalExtractionEngine {
  extractGoals(answers = {}) {
    const goals = [];

    goals.push(
      ...this.extractPrimaryGoal(answers)
    );

    goals.push(
      ...this.extractSecondaryGoals(answers)
    );

    goals.push(
      ...this.extractFreeTextGoals(answers)
    );

    return this.removeDuplicates(goals);
  }

  extractPrimaryGoal(answers) {
    const goal =
      answers.primary_investment_goal;

    if (!goal) {
      return [];
    }

    return [
      this.buildGoal(
        goal,
        GOAL_EXTRACTION_SOURCE.PRIMARY_GOAL
      ),
    ];
  }

  extractSecondaryGoals(answers) {
    const goals =
      answers.secondary_goals || [];

    if (!Array.isArray(goals)) {
      return [];
    }

    return goals.map((goal) =>
      this.buildGoal(
        goal,
        GOAL_EXTRACTION_SOURCE.SECONDARY_GOAL
      )
    );
  }

  extractFreeTextGoals(answers) {
    const extractedGoals = [];

    Object.values(answers).forEach((answer) => {
      if (typeof answer !== "string") {
        return;
      }

      const text =
        answer.toLowerCase();

      Object.entries(
        GOAL_KEYWORDS
      ).forEach(
        ([goalType, keywords]) => {
          if (
            keywords.some((keyword) =>
              text.includes(
                keyword.toLowerCase()
              )
            )
          ) {
            extractedGoals.push(
              this.buildGoal(
                goalType,
                GOAL_EXTRACTION_SOURCE.FREE_TEXT,
                text
              )
            );
          }
        }
      );
    });

    return extractedGoals;
  }

  buildGoal(
    goal,
    source,
    text = ""
  ) {
    const years =
      this.extractTimeline(text);

    return {
      type:
        this.normalizeGoalType(goal),

      category:
        this.getCategory(goal),

      priority:
        this.getPriority(goal),

      horizon:
        this.getHorizon(years),

      timelineYears: years,

      status:
        GOAL_STATUS.IDENTIFIED,

      source,
    };
  }

  extractTimeline(text) {
    if (!text) {
      return null;
    }

    const match =
      text.match(
        /(\d+)\s*(year|years)/i
      );

    return match
      ? Number(match[1])
      : null;
  }

  getHorizon(years) {
    if (years === null) {
      return null;
    }

    if (
      years <=
      HORIZON_THRESHOLDS.SHORT_TERM_MAX_YEARS
    ) {
      return GOAL_HORIZON.SHORT_TERM;
    }

    if (
      years <=
      HORIZON_THRESHOLDS.MEDIUM_TERM_MAX_YEARS
    ) {
      return GOAL_HORIZON.MEDIUM_TERM;
    }

    return GOAL_HORIZON.LONG_TERM;
  }

  getPriority(goal) {
    switch (
      this.normalizeGoalType(goal)
    ) {
      case GOAL_TYPES.EMERGENCY_FUND:
        return GOAL_PRIORITY.CRITICAL;

      case GOAL_TYPES.HOUSE:
      case GOAL_TYPES.RETIREMENT:
      case GOAL_TYPES.EDUCATION:
        return GOAL_PRIORITY.HIGH;

      case GOAL_TYPES.WEALTH_CREATION:
      case GOAL_TYPES.BUSINESS:
        return GOAL_PRIORITY.MEDIUM;

      default:
        return GOAL_PRIORITY.LOW;
    }
  }

  getCategory(goal) {
    switch (
      this.normalizeGoalType(goal)
    ) {
      case GOAL_TYPES.HOUSE:
      case GOAL_TYPES.VEHICLE:
        return GOAL_CATEGORIES.ASSET_CREATION;

      case GOAL_TYPES.RETIREMENT:
        return GOAL_CATEGORIES.RETIREMENT;

      case GOAL_TYPES.EDUCATION:
      case GOAL_TYPES.HIGHER_EDUCATION:
      case GOAL_TYPES.CHILD_EDUCATION:
        return GOAL_CATEGORIES.EDUCATION;

      case GOAL_TYPES.BUSINESS:
        return GOAL_CATEGORIES.BUSINESS;

      case GOAL_TYPES.EMERGENCY_FUND:
      case GOAL_TYPES.INSURANCE:
        return GOAL_CATEGORIES.PROTECTION;

      case GOAL_TYPES.WEALTH_CREATION:
      case GOAL_TYPES.FINANCIAL_FREEDOM:
        return GOAL_CATEGORIES.WEALTH;

      case GOAL_TYPES.DEBT_REPAYMENT:
        return GOAL_CATEGORIES.DEBT;

      default:
        return GOAL_CATEGORIES.LIFESTYLE;
    }
  }

  normalizeGoalType(goal) {
    if (!goal) {
      return GOAL_TYPES.OTHER;
    }

    const normalized =
      String(goal)
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_");

    return (
      GOAL_TYPES[normalized] ||
      GOAL_TYPES.OTHER
    );
  }

  removeDuplicates(goals) {
    const unique = new Map();

    goals.forEach((goal) => {
      if (!unique.has(goal.type)) {
        unique.set(goal.type, goal);
      }
    });

    return Array.from(
      unique.values()
    );
  }
}

module.exports =
  new GoalExtractionEngine();