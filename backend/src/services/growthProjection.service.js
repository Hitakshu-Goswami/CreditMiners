const growthProjectionEngine =
    require("../engines/growthProjection.engine");

const chartEngine =
    require("../engines/chart.engine");

const insightEngine =
    require("../engines/insight.engine");
    
const growthProjectionRepository =
    require("../repositories/growthProjection.repository");
    
const responseMapper =
    require("../mappers/growthProjection.response.mapper");
    const growthProjectionValidator =
    require("../validators/growthProjection.validator");


const logger =
    require("../utils/logger");

class GrowthProjectionService {
    /**
 * -------------------------------------------------------
 * Save Growth Projection
 * -------------------------------------------------------
 */

async saveProjection(
    userId,
    result
) {


    const moderate =
        result.growthProjection
            .scenarios
            .moderate;



    const scenarios =

        Object.keys(

            result.growthProjection.scenarios

        )
        .map(

            key => {

                const scenario =
                    result.growthProjection
                        .scenarios[key];


                return {

                    name:
                        key,


                    expectedReturn:
                        scenario
                            .scenario
                            .assumptions
                            .expectedReturn,


                    salaryGrowth:
                        scenario
                            .scenario
                            .assumptions
                            .salaryGrowth,


                    expenseGrowth:
                        scenario
                            .scenario
                            .assumptions
                            .expenseGrowth,


                    savingsGrowth:
                        scenario
                            .scenario
                            .assumptions
                            .savingsGrowth,


                    confidence:
                        scenario
                            .scenario
                            .confidence

                };

            }

        );



    const snapshots =

        moderate
            .forecast
            .yearlyForecasts
            .map(

                item => ({

                    year:
                        item.year,


                    income:
                        item.income,


                    expenses:
                        item.expenses,


                    savings:
                        item.savings,


                    investments:
                        item.wealth
                            .investments,


                    netWorth:
                        item.wealth
                            .netWorth,


                    cashFlow:
                        item.monthlyCashFlow

                })

            );



    const goals =

        moderate
            .goalProjection
            .analyzedGoals
            .map(

                goal => ({

                    goalName:
                        goal.name,


                    targetAmount:
                        goal.targetAmount,


                    targetYear:
                        goal.targetYear,


                    projectedAmount:
                        goal.projectedAmount,


                    fundingGap:
                        goal.fundingGap,


                    progress:
                        goal.progress,


                    probability:
                        goal.probability,


                    status:
                        goal.status

                })

            );



    return growthProjectionRepository
        .createCompleteProjection({

            userId,


            scenarioType:
                result.growthProjection
                    .bestScenario
                    .scenario,


            projectionYears:
                moderate
                    .forecast
                    .duration,


            wealthScore:
                moderate
                    .wealthProjection
                    .wealthScore,


            projectedNetWorth:
                moderate
                    .wealthProjection
                    .wealthAnalysis
                    .projected,


            financialFreedomProgress:
                moderate
                    .wealthProjection
                    .financialFreedom
                    .progress,


            status:
                "COMPLETED",


            scenarios,


            snapshots,


            goals

        });

}


    /**
     * -------------------------------------------------------
     * Generate Growth Projection
     * -------------------------------------------------------
     */

async generateGrowthProjection(
    userId,
    data
) {

    try {


        // Validate input before running engines
        growthProjectionValidator.validate(
            data
        );


        // Generate complete growth projection
        const growthProjection =
            growthProjectionEngine
                .generateProjection(
                    data
                );



        // Generate frontend chart data
        const charts =
            chartEngine
                .generateCharts({

                    growthProjection

                });



        // Generate AI insights
        const insights =
            insightEngine
                .generateInsights({

                    growthProjection

                });



        const result = {

            growthProjection,

            charts,

            insights

        };



        // Save complete projection to database
        const savedProjection =
            await this.saveProjection(

                userId,

                result

            );



        return {

            ...result,

            savedProjection

        };


    }
    catch(error) {


        logger.error(

            "Growth Projection Generation Failed",

            error

        );


        throw error;


    }

}

    /**
     * -------------------------------------------------------
     * Prepare Projection Input
     * -------------------------------------------------------
     */

    prepareInput(
        financialSnapshot,
        behaviourSignals,
        riskProfile,
        goals,
        projectionYears
    ) {


        return {

            financialSnapshot,

            behaviourSignals,

            riskProfile,

            goals,

            projectionYears,

            investmentPlan: true

        };

    }
    /**
 * -------------------------------------------------------
 * Projection History
 * -------------------------------------------------------
 */

async getProjectionHistory(
    userId
) {

const history =
    await growthProjectionRepository
        .getHistory(
            userId
        );


return responseMapper
    .mapHistory(
        history
    );
}


}


module.exports =
    new GrowthProjectionService();