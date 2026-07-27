const {
    WEALTH_MILESTONES,
    EMERGENCY_FUND
} = require("../constants/growthProjection.constants");

class WealthProjectionEngine {

    /**
     * -------------------------------------------------------
     * Generate Wealth Projection
     * -------------------------------------------------------
     */

    generateWealthProjection(data) {

        this.validateInput(data);

        const {
            scenario,
            forecast
        } = data;

        const projection =
            this.initializeProjection(
                scenario,
                forecast
            );

        projection.wealthAnalysis =
    this.analyzeNetWorth(
        projection
    );

projection.financialFreedom =
    this.analyzeFinancialIndependence(
        projection
    );

projection.emergencyFund =
    this.analyzeEmergencyFund(
        projection
    );

projection.investmentHealth =
    this.analyzeInvestmentHealth(
        projection
    );

projection.wealthScore =
    this.calculateWealthScore(
        projection
    );

projection.milestones =
    this.buildMilestones(
        projection
    );

projection.recommendations =
    this.buildRecommendations(
        projection,
        projection.wealthScore
    );

projection.summary = {

    wealthScore:
        projection.wealthScore,

    projectedNetWorth:
        projection.wealthAnalysis.projected,

    financialFreedom:
        projection.financialFreedom.progress,

    emergencyFundReady:
        projection.emergencyFund.ready

};

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
                "Projection data is required."
            );

        if (!data.scenario)
            throw new Error(
                "Scenario is required."
            );

        if (!data.forecast)
            throw new Error(
                "Forecast is required."
            );

        if (
            !Array.isArray(
                data.forecast.yearlyForecasts
            )
        )
            throw new Error(
                "Yearly forecasts are required."
            );

    }

    /**
     * -------------------------------------------------------
     * Initialize Projection
     * -------------------------------------------------------
     */

    initializeProjection(
        scenario,
        forecast
    ) {

        const latestForecast =
            forecast.yearlyForecasts[
                forecast.yearlyForecasts.length - 1
            ];

        return {

            scenario:
                scenario.scenario,

            duration:
                forecast.duration,

            currentFinancials:
                forecast.currentFinancials,

            latestForecast,

            wealthAnalysis: {},

            financialFreedom: {},

            emergencyFund: {},

            investmentHealth: {},

            milestones: [],

            recommendations: [],

            summary: {},

            metadata: {

                generatedAt:
                    new Date(),

                engine:
                    "WealthProjectionEngine"

            }

        };

    }

    /**
     * -------------------------------------------------------
     * Latest Net Worth
     * -------------------------------------------------------
     */

    getLatestNetWorth(
        projection
    ) {

        return Number(

            projection.latestForecast
                ?.wealth
                ?.netWorth || 0

        );

    }

    /**
     * -------------------------------------------------------
     * Emergency Fund Target
     * -------------------------------------------------------
     */

    getEmergencyFundTarget(
        projection
    ) {

        return (

            projection.currentFinancials.expenses *

            EMERGENCY_FUND.MONTHS

        );

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
 * Analyze Net Worth
 * -------------------------------------------------------
 */

analyzeNetWorth(
    projection
) {

    const initialNetWorth =
        projection.currentFinancials.assets -
        projection.currentFinancials.liabilities;

    const projectedNetWorth =
        this.getLatestNetWorth(
            projection
        );

    const growth =
        projectedNetWorth -
        initialNetWorth;

    return {

        current:
            this.round(initialNetWorth),

        projected:
            this.round(projectedNetWorth),

        growth:
            this.round(growth),

        growthPercentage:
            initialNetWorth > 0

                ? this.round(
                    (growth / initialNetWorth) * 100
                )

                : 0

    };

}
/**
 * -------------------------------------------------------
 * Analyze Financial Independence
 * -------------------------------------------------------
 */

analyzeFinancialIndependence(
    projection
) {

    const annualExpenses =

        projection.latestForecast.expenses *

        12;

    const targetCorpus =

        annualExpenses * 25;

    const currentNetWorth =

        this.getLatestNetWorth(
            projection
        );

    return {

        targetCorpus:
            this.round(targetCorpus),

        currentCorpus:
            currentNetWorth,

        progress:

            this.clamp(

                this.calculatePercentage(

                    currentNetWorth,

                    targetCorpus

                ),

                0,

                100

            )

    };

}

/**
 * -------------------------------------------------------
 * Analyze Emergency Fund
 * -------------------------------------------------------
 */

analyzeEmergencyFund(
    projection
) {

    const currentSavings =

        projection.latestForecast.savings;

    const target =

        this.getEmergencyFundTarget(
            projection
        );

    return {

        current:
            currentSavings,

        target,

        ready:
            currentSavings >= target,

        completion:

            this.clamp(

                this.calculatePercentage(

                    currentSavings,

                    target

                ),

                0,

                100

            )

    };

}
/**
 * -------------------------------------------------------
 * Analyze Investment Health
 * -------------------------------------------------------
 */

analyzeInvestmentHealth(
    projection
) {

    const investments =

        projection.latestForecast
            .wealth
            .investments;

    const assets =

        projection.latestForecast
            .wealth
            .assets;

    return {

        investmentValue:
            investments,

        allocation:

            this.calculatePercentage(

                investments,

                assets

            ),

        status:

            investments >= assets * 0.40

                ? "Excellent"

                : investments >= assets * 0.25

                    ? "Good"

                    : "Needs Improvement"

    };

}
/**
 * -------------------------------------------------------
 * Wealth Score
 * -------------------------------------------------------
 */

calculateWealthScore(
    projection
) {

    const netWorth =

        this.analyzeNetWorth(
            projection
        );

    const freedom =

        this.analyzeFinancialIndependence(
            projection
        );

    const emergency =

        this.analyzeEmergencyFund(
            projection
        );

    const investment =

        this.analyzeInvestmentHealth(
            projection
        );

    const score =

        (

            freedom.progress * 0.40 +

            emergency.completion * 0.25 +

            investment.allocation * 0.20 +

            Math.min(

                netWorth.growthPercentage,

                100

            ) * 0.15

        );

    return this.round(

        this.clamp(

            score,

            0,

            100

        )

    );

}
/**
 * -------------------------------------------------------
 * Wealth Milestones
 * -------------------------------------------------------
 */

buildMilestones(
    projection
) {

    const netWorth =

        this.getLatestNetWorth(
            projection
        );

    return Object.values(

        WEALTH_MILESTONES

    ).map(

        (milestone) => ({

            milestone,

            achieved:

                netWorth >= milestone

        })

    );

}
/**
 * -------------------------------------------------------
 * Wealth Recommendations
 * -------------------------------------------------------
 */

buildRecommendations(
    projection,
    wealthScore
) {

    const recommendations = [];

    const emergency =

        this.analyzeEmergencyFund(
            projection
        );

    if (!emergency.ready)

        recommendations.push(

            "Increase emergency savings to reach the recommended reserve."

        );

    if (wealthScore < 50)

        recommendations.push(

            "Increase monthly investments to improve long-term wealth."

        );

    const investment =

        this.analyzeInvestmentHealth(
            projection
        );

    if (investment.status === "Needs Improvement")

        recommendations.push(

            "Allocate a larger portion of savings towards investments."

        );

    if (!recommendations.length)

        recommendations.push(

            "Continue your current financial strategy and review your portfolio periodically."

        );

    return recommendations;

}
/**
 * -------------------------------------------------------
 * Validate Projection
 * -------------------------------------------------------
 */

validateProjection(
    projection
) {

    projection.wealthScore =
        this.clamp(
            projection.wealthScore,
            0,
            100
        );

    projection.financialFreedom.progress =
        this.clamp(
            projection.financialFreedom.progress,
            0,
            100
        );

    projection.emergencyFund.completion =
        this.clamp(
            projection.emergencyFund.completion,
            0,
            100
        );

    return projection;

}
/**
 * -------------------------------------------------------
 * Normalize Projection
 * -------------------------------------------------------
 */

normalizeProjection(
    projection
) {

    projection.summary = {

        ...projection.summary

    };

    projection.wealthAnalysis = {

        ...projection.wealthAnalysis

    };

    projection.financialFreedom = {

        ...projection.financialFreedom

    };

    projection.investmentHealth = {

        ...projection.investmentHealth

    };

    return projection;

}
/**
 * -------------------------------------------------------
 * Attach Metadata
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
            "WealthProjectionEngine"

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

    this.normalizeProjection(
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
    new WealthProjectionEngine();