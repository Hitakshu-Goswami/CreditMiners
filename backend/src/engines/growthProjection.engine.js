const scenarioEngine =
    require("./scenario.engine");

const forecastingEngine =
    require("./forecasting.engine");

const wealthProjectionEngine =
    require("./wealthProjection.engine");

const goalProjectionEngine =
    require("./goalProjection.engine");


class GrowthProjectionEngine {


    /**
     * -------------------------------------------------------
     * Generate Complete Growth Projection
     * -------------------------------------------------------
     */

    generateProjection(data) {

        this.validateInput(data);


        const scenarios =
            scenarioEngine.generateScenarios(
                data
            );


        const result = {

            scenarios: {},

            metadata: {

                generatedAt:
                    new Date(),

                engine:
                    "GrowthProjectionEngine"

            }

        };


        Object.keys(scenarios)
            .forEach(
                scenarioKey => {


                    const scenario =
                        scenarios[scenarioKey];


                    const forecast =
                        forecastingEngine.generateForecast({

                            scenario,

                            projectionYears:
                                data.projectionYears,

                            financialSnapshot:
                                data.financialSnapshot

                        });



                    const wealthProjection =
                        wealthProjectionEngine
                            .generateWealthProjection({

                                scenario,

                                forecast

                            });



                    const goalProjection =
                        goalProjectionEngine
                            .generateGoalProjection({

                                scenario,

                                forecast,

                                wealthProjection,

                                goals:
                                    data.goals || []

                            });



                    result.scenarios[scenarioKey] = {

                        scenario,

                        forecast,

                        wealthProjection,

                        goalProjection

                    };


                }
            );


        return result;

    }



    /**
     * -------------------------------------------------------
     * Validate Input
     * -------------------------------------------------------
     */

    validateInput(data) {


        if (!data)

            throw new Error(
                "Growth projection data is required."
            );



        if (!data.financialSnapshot)

            throw new Error(
                "Financial snapshot is required."
            );



        if (!data.behaviourSignals)

            throw new Error(
                "Behaviour signals are required."
            );



        if (!data.riskProfile)

            throw new Error(
                "Risk profile is required."
            );



        if (!data.investmentPlan)

            throw new Error(
                "Investment plan is required."
            );


    }



    /**
     * -------------------------------------------------------
     * Get Scenario Names
     * -------------------------------------------------------
     */

    getScenarioNames() {

        return [

            "conservative",

            "moderate",

            "aggressive"

        ];

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
 * Compare Scenarios
 * -------------------------------------------------------
 */

compareScenarios(
    scenarios
) {

    const comparison = {};

    Object.keys(scenarios)
        .forEach(
            key => {

                const scenario =
                    scenarios[key];


                comparison[key] = {

                    projectedNetWorth:

                        scenario
                            .wealthProjection
                            .wealthAnalysis
                            .projected,


                    wealthScore:

                        scenario
                            .wealthProjection
                            .wealthScore,


                    financialFreedom:

                        scenario
                            .wealthProjection
                            .financialFreedom
                            .progress,


                    goalProgress:

                        scenario
                            .goalProjection
                            .summary
                            .averageProgress

                };


            }
        );


    return comparison;

}

/**
 * -------------------------------------------------------
 * Best Scenario
 * -------------------------------------------------------
 */

findBestScenario(
    comparison
) {

    let bestScenario =
        "moderate";


    let highestScore =
        0;


    Object.keys(comparison)
        .forEach(
            key => {


                const score =

                    (

                        comparison[key]
                            .wealthScore

                        +

                        comparison[key]
                            .goalProgress

                    ) / 2;



                if(score > highestScore) {

                    highestScore =
                        score;

                    bestScenario =
                        key;

                }


            }
        );


    return {

        scenario:
            bestScenario,

        score:
            this.round(
                highestScore
            )

    };

}
/**
 * -------------------------------------------------------
 * Growth Summary
 * -------------------------------------------------------
 */

generateGrowthSummary(
    scenarios
) {


    const moderate =
        scenarios.moderate;


    if(!moderate)
        return {};


    return {

        projectedNetWorth:

            moderate
                .wealthProjection
                .wealthAnalysis
                .projected,


        wealthScore:

            moderate
                .wealthProjection
                .wealthScore,


        financialFreedom:

            moderate
                .wealthProjection
                .financialFreedom
                .progress,


        goals:

            moderate
                .goalProjection
                .summary


    };


}
/**
 * -------------------------------------------------------
 * Risk Adjusted Recommendation
 * -------------------------------------------------------
 */

generateRecommendation(
    comparison
) {


    const best =
        this.findBestScenario(
            comparison
        );


    if(
        best.scenario ===
        "aggressive"
    ) {

        return {

            recommendedScenario:
                "AGGRESSIVE",

            reason:
                "Higher growth potential suitable for users with strong financial stability and risk tolerance."

        };

    }


    if(
        best.scenario ===
        "conservative"
    ) {

        return {

            recommendedScenario:
                "CONSERVATIVE",

            reason:
                "Focuses on capital preservation and financial safety."

        };

    }


    return {

        recommendedScenario:
            "MODERATE",

        reason:
            "Balanced approach providing sustainable growth with controlled risk."

    };


}


}


module.exports =
    new GrowthProjectionEngine();