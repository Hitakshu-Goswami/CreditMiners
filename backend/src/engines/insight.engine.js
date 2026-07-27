class InsightEngine {


    /**
     * -------------------------------------------------------
     * Generate Insights
     * -------------------------------------------------------
     */

    generateInsights(data) {

        this.validateInput(data);


        const projection =
            data.growthProjection;


        const insights = {

            summaryInsights:
                [],

            strengths:
                [],

            risks:
                [],

            actionPlan:
                [],

            futureOutlook:
                {},

            metadata: {

                generatedAt:
                    new Date(),

                engine:
                    "InsightEngine"

            }

        };


        insights.summaryInsights =
            this.generateSummaryInsights(
                projection
            );


        insights.strengths =
            this.generateStrengths(
                projection
            );


        insights.risks =
            this.generateRisks(
                projection
            );


        insights.actionPlan =
            this.generateActionPlan(
                projection
            );


        insights.futureOutlook =
            this.generateFutureOutlook(
                projection
            );


        return insights;

    }



    /**
     * -------------------------------------------------------
     * Validate Input
     * -------------------------------------------------------
     */

    validateInput(data) {

        if(!data)

            throw new Error(
                "Insight data is required."
            );


        if(!data.growthProjection)

            throw new Error(
                "Growth projection is required."
            );

    }



    /**
     * -------------------------------------------------------
     * Summary Insights
     * -------------------------------------------------------
     */

    generateSummaryInsights(
        projection
    ) {

        const summary = [];


        const recommendation =
            projection.recommendation;


        if(recommendation) {

            summary.push(

                `Recommended strategy: ${recommendation.recommendedScenario}.`

            );

        }


        if(
            projection.summary?.projectedNetWorth
        ) {

            summary.push(

                `Your projected wealth can grow to ₹${projection.summary.projectedNetWorth}.`

            );

        }


        return summary;

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
 * Financial Strengths
 * -------------------------------------------------------
 */

generateStrengths(
    projection
) {

    const strengths = [];


    const moderate =
        projection
            .scenarios
            ?.moderate;


    if(!moderate)
        return strengths;



    const wealth =
        moderate
            .wealthProjection;



    if(
        wealth.wealthScore >= 75
    ) {

        strengths.push(

            "Strong overall financial health supports long-term wealth creation."

        );

    }



    if(
        wealth.emergencyFund?.ready
    ) {

        strengths.push(

            "Emergency fund readiness provides financial stability."

        );

    }



    if(
        wealth.investmentHealth?.status ===
        "Excellent"
    ) {

        strengths.push(

            "Healthy investment allocation improves future growth potential."

        );

    }



    if(
        moderate.goalProjection
            ?.summary
            ?.averageProgress >= 80
    ) {

        strengths.push(

            "Current financial strategy is aligned with major life goals."

        );

    }



    return strengths;

}

/**
 * -------------------------------------------------------
 * Financial Risks
 * -------------------------------------------------------
 */

generateRisks(
    projection
) {

    const risks = [];


    const moderate =
        projection
            .scenarios
            ?.moderate;


    if(!moderate)
        return risks;



    const wealth =
        moderate
            .wealthProjection;



    if(
        !wealth.emergencyFund?.ready
    ) {

        risks.push(

            "Emergency fund is below the recommended safety level."

        );

    }



    if(
        wealth.wealthScore < 50
    ) {

        risks.push(

            "Current wealth trajectory requires improvement through better saving and investing habits."

        );

    }



    const goals =
        moderate
            .goalProjection
            ?.analyzedGoals || [];



    goals.forEach(

        goal => {

            if(
                goal.status === "High Risk"
            ) {

                risks.push(

                    `${goal.name} has a low probability of achievement without additional savings.`

                );

            }

        }

    );



    return risks;

}
/**
 * -------------------------------------------------------
 * Financial Action Plan
 * -------------------------------------------------------
 */

generateActionPlan(
    projection
) {

    const actions = [];


    const moderate =
        projection
            .scenarios
            ?.moderate;



    if(!moderate)
        return actions;



    const wealth =
        moderate
            .wealthProjection;



    if(
        !wealth.emergencyFund?.ready
    ) {

        actions.push({

            priority:
                "HIGH",

            action:
                "Build emergency fund before increasing risky investments."

        });

    }



    if(
        wealth.investmentHealth?.status ===
        "Needs Improvement"
    ) {

        actions.push({

            priority:
                "MEDIUM",

            action:
                "Increase investment allocation gradually through disciplined contributions."

        });

    }



    actions.push({

        priority:
            "LOW",

        action:
            "Review financial goals periodically and rebalance investments when required."

    });



    return actions;

}
/**
 * -------------------------------------------------------
 * Future Outlook
 * -------------------------------------------------------
 */

generateFutureOutlook(
    projection
) {

    const moderate =
        projection
            .scenarios
            ?.moderate;


    if(!moderate)
        return {};



    const wealth =
        moderate
            .wealthProjection;



    return {

        projectedNetWorth:

            wealth
                .wealthAnalysis
                .projected,


        wealthScore:

            wealth
                .wealthScore,


        financialFreedomProgress:

            wealth
                .financialFreedom
                .progress,


        outlook:

            wealth.wealthScore >= 75

                ? "Positive"

                : wealth.wealthScore >= 50

                    ? "Stable"

                    : "Needs Improvement"

    };

}
}


module.exports =
    new InsightEngine();