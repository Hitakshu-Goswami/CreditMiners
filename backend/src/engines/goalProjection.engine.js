const {
    GOAL_PROBABILITY
} = require("../constants/growthProjection.constants");

class GoalProjectionEngine {

    /**
     * -------------------------------------------------------
     * Generate Goal Projection
     * -------------------------------------------------------
     */

    generateGoalProjection(data) {

        this.validateInput(data);

        const {
            scenario,
            forecast,
            wealthProjection,
            goals = []
        } = data;

        const projection =
            this.initializeProjection(
                scenario,
                forecast,
                wealthProjection,
                goals
            );
projection.analyzedGoals =

    projection.goals

        .filter(

            (goal) =>

                this.validateGoal(
                    goal
                )

        )

        .map(

            (goal) =>

                this.enrichGoalAnalysis(

                    this.buildGoalAnalysis(
                        goal,
                        forecast
                    )

                )

        );

projection.analyzedGoals =
    this.rankGoals(
        projection.analyzedGoals
    );


projection.summary =
    this.buildGoalSummary(
        projection.analyzedGoals
    );


projection.recommendations =
    this.buildRecommendations(
        projection.analyzedGoals
    );


return this.finalizeProjection(
    projection
);

    }

    /**
     * -------------------------------------------------------
     * Validate Input
     * -------------------------------------------------------
     */

    validateInput(data) {

        if (!data)
            throw new Error(
                "Goal projection data is required."
            );

        if (!data.scenario)
            throw new Error(
                "Scenario is required."
            );

        if (!data.forecast)
            throw new Error(
                "Forecast is required."
            );

        if (!data.wealthProjection)
            throw new Error(
                "Wealth projection is required."
            );

    }

    /**
     * -------------------------------------------------------
     * Initialize Projection
     * -------------------------------------------------------
     */

    initializeProjection(
        scenario,
        forecast,
        wealthProjection,
        goals
    ) {

        return {

            scenario:
                scenario.scenario,

            duration:
                forecast.duration,

            wealthScore:
                wealthProjection.wealthScore,

            goals,

            analyzedGoals: [],

            summary: {},

            recommendations: [],

            metadata: {

                generatedAt:
                    new Date(),

                engine:
                    "GoalProjectionEngine"

            }

        };

    }

    /**
     * -------------------------------------------------------
     * Find Forecast By Year
     * -------------------------------------------------------
     */

    getForecastForYear(
        forecast,
        year
    ) {

        return forecast
            .yearlyForecasts
            .find(

                (item) =>

                    item.year === year

            ) ||

            forecast.yearlyForecasts[
                forecast.yearlyForecasts.length - 1
            ];

    }

    /**
     * -------------------------------------------------------
     * Safe Percentage
     * -------------------------------------------------------
     */

    calculatePercentage(
        value,
        total
    ) {

        if (!total)
            return 0;

        return this.round(

            (value / total) * 100

        );

    }

    /**
     * -------------------------------------------------------
     * Clamp
     * -------------------------------------------------------
     */

    clamp(
        value,
        min,
        max
    ) {

        return Math.max(

            min,

            Math.min(
                max,
                value
            )

        );

    }

    /**
     * -------------------------------------------------------
     * Round
     * -------------------------------------------------------
     */

    round(
        value,
        digits = 2
    ) {

        return Number(

            Number(value)
                .toFixed(digits)

        );

    }

    /**
 * -------------------------------------------------------
 * Validate Goal
 * -------------------------------------------------------
 */

validateGoal(
    goal
) {

    return Boolean(

        goal &&
        goal.name &&
        goal.targetAmount &&
        goal.targetYear

    );

}
/**
 * -------------------------------------------------------
 * Analyze Goal
 * -------------------------------------------------------
 */

analyzeGoal(
    goal,
    forecast
) {

    const yearForecast =
        this.getForecastForYear(
            forecast,
            goal.targetYear
        );

    const projectedWealth =
        yearForecast.wealth.netWorth;

    const fundingGap =
        Math.max(
            0,
            goal.targetAmount -
            projectedWealth
        );

    return {

        name:
            goal.name,

        targetAmount:
            goal.targetAmount,

        targetYear:
            goal.targetYear,

        projectedAmount:
            projectedWealth,

        fundingGap,

        achieved:
            projectedWealth >= goal.targetAmount

    };

}
/**
 * -------------------------------------------------------
 * Goal Progress
 * -------------------------------------------------------
 */

calculateGoalProgress(
    goalAnalysis
) {

    return this.clamp(

        this.calculatePercentage(

            goalAnalysis.projectedAmount,

            goalAnalysis.targetAmount

        ),

        0,

        100

    );

}
/**
 * -------------------------------------------------------
 * Goal Status
 * -------------------------------------------------------
 */

determineGoalStatus(
    goalAnalysis
) {

    if (goalAnalysis.achieved)
        return "Achieved";

    if (
        goalAnalysis.fundingGap <=
        goalAnalysis.targetAmount * 0.10
    )
        return "On Track";

    if (
        goalAnalysis.fundingGap <=
        goalAnalysis.targetAmount * 0.30
    )
        return "Needs Attention";

    return "High Risk";

}
/**
 * -------------------------------------------------------
 * Goal Category
 * -------------------------------------------------------
 */

categorizeGoal(
    goal
) {

    const year =
        goal.targetYear;

    if (year <= 2)
        return "Short Term";

    if (year <= 5)
        return "Medium Term";

    return "Long Term";

}
/**
 * -------------------------------------------------------
 * Build Goal Analysis
 * -------------------------------------------------------
 */

buildGoalAnalysis(
    goal,
    forecast
) {

    const analysis =
        this.analyzeGoal(
            goal,
            forecast
        );

    analysis.progress =
        this.calculateGoalProgress(
            analysis
        );

    analysis.status =
        this.determineGoalStatus(
            analysis
        );

    analysis.category =
        this.categorizeGoal(
            goal
        );

    return analysis;

}
/**
 * -------------------------------------------------------
 * Goal Achievement Probability
 * -------------------------------------------------------
 */

calculateGoalProbability(
    goalAnalysis
) {

    const progress =
        goalAnalysis.progress;

    if (
        progress >=
        GOAL_PROBABILITY.HIGH
    )
        return "High";

    if (
        progress >=
        GOAL_PROBABILITY.MEDIUM
    )
        return "Medium";

    return "Low";

}

/**
 * -------------------------------------------------------
 * Required Monthly Savings
 * -------------------------------------------------------
 */

calculateRequiredMonthlySavings(
    goalAnalysis
) {

    if (
        goalAnalysis.fundingGap <= 0
    )
        return 0;

    const months =
        Math.max(
            goalAnalysis.targetYear * 12,
            1
        );

    return this.round(

        goalAnalysis.fundingGap /

        months

    );

}
/**
 * -------------------------------------------------------
 * Goal Priority
 * -------------------------------------------------------
 */

prioritizeGoal(
    goalAnalysis
) {

    if (
        goalAnalysis.category ===
        "Short Term"
    )
        return "High";

    if (
        goalAnalysis.category ===
        "Medium Term"
    )
        return "Medium";

    return "Low";

}
/**
 * -------------------------------------------------------
 * Goal Feasibility
 * -------------------------------------------------------
 */

determineGoalFeasibility(
    goalAnalysis
) {

    if (
        goalAnalysis.progress >= 100
    )
        return "Achievable";

    if (
        goalAnalysis.progress >= 80
    )
        return "Likely";

    if (
        goalAnalysis.progress >= 60
    )
        return "Possible";

    return "Unlikely";

}
/**
 * -------------------------------------------------------
 * Enrich Goal Analysis
 * -------------------------------------------------------
 */

enrichGoalAnalysis(
    goalAnalysis
) {

    goalAnalysis.probability =
        this.calculateGoalProbability(
            goalAnalysis
        );

    goalAnalysis.requiredMonthlySavings =
        this.calculateRequiredMonthlySavings(
            goalAnalysis
        );

    goalAnalysis.priority =
        this.prioritizeGoal(
            goalAnalysis
        );

    goalAnalysis.feasibility =
        this.determineGoalFeasibility(
            goalAnalysis
        );

    return goalAnalysis;

}
/**
 * -------------------------------------------------------
 * Goal Summary
 * -------------------------------------------------------
 */

buildGoalSummary(
    analyzedGoals
) {

    const totalGoals =
        analyzedGoals.length;


    const achievedGoals =
        analyzedGoals.filter(

            goal =>
                goal.achieved

        ).length;


    const highRiskGoals =
        analyzedGoals.filter(

            goal =>
                goal.status === "High Risk"

        ).length;


    const averageProgress =

        totalGoals

            ? this.round(

                analyzedGoals.reduce(

                    (sum, goal) =>

                        sum + goal.progress,

                    0

                ) / totalGoals

            )

            : 0;


    return {

        totalGoals,

        achievedGoals,

        pendingGoals:
            totalGoals - achievedGoals,

        highRiskGoals,

        averageProgress

    };

}
/**
 * -------------------------------------------------------
 * Goal Recommendations
 * -------------------------------------------------------
 */

buildRecommendations(
    analyzedGoals
) {

    const recommendations = [];


    analyzedGoals.forEach(

        (goal) => {


            if (
                goal.status === "High Risk"
            ) {

                recommendations.push(

                    `Increase savings allocation towards ${goal.name} because it currently has a low achievement probability.`

                );

            }


            if (
                goal.fundingGap > 0 &&
                goal.requiredMonthlySavings > 0
            ) {

                recommendations.push(

                    `Invest approximately ₹${goal.requiredMonthlySavings} monthly to improve progress towards ${goal.name}.`

                );

            }


            if (
                goal.achieved
            ) {

                recommendations.push(

                    `${goal.name} is projected to be achieved successfully.`

                );

            }


        }

    );


    if (!recommendations.length) {

        recommendations.push(

            "Continue maintaining your current financial strategy and review goals periodically."

        );

    }


    return recommendations;

}
/**
 * -------------------------------------------------------
 * Rank Goals
 * -------------------------------------------------------
 */

rankGoals(
    analyzedGoals
) {

    return analyzedGoals.sort(

        (a, b) => {


            const priorityScore = {

                High: 3,

                Medium: 2,

                Low: 1

            };


            return (

                priorityScore[b.priority] -

                priorityScore[a.priority]

            );

        }

    );

}
/**
 * -------------------------------------------------------
 * Validate Projection
 * -------------------------------------------------------
 */

validateProjection(
    projection
) {

    projection.analyzedGoals =
        projection.analyzedGoals.filter(

            goal =>
                goal.name &&
                goal.targetAmount

        );


    if (
        !projection.analyzedGoals.length
    ) {

        throw new Error(
            "No valid goals available."
        );

    }


    return projection;

}
/**
 * -------------------------------------------------------
 * Metadata
 * -------------------------------------------------------
 */

attachMetadata(
    projection
) {

    projection.metadata = {

        ...projection.metadata,

        version: 1,

        generatedAt:
            new Date(),

        engine:
            "GoalProjectionEngine",

        totalGoals:
            projection.analyzedGoals.length

    };


    return projection;

}
/**
 * -------------------------------------------------------
 * Finalize Projection
 * -------------------------------------------------------
 */

finalizeProjection(
    projection
) {

    this.validateProjection(
        projection
    );


    this.attachMetadata(
        projection
    );


    return Object.freeze(
        projection
    );

}
}

module.exports =
    new GoalProjectionEngine();