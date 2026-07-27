class GrowthProjectionResponseMapper {


    /**
     * -------------------------------------------------------
     * Map Full Projection Response
     * -------------------------------------------------------
     */

    mapProjection(
        projection
    ) {


        return {

            id:
                projection.id,


            summary: {

                scenario:
                    projection.scenarioType,


                years:
                    projection.projectionYears,


                wealthScore:
                    projection.wealthScore,


                projectedNetWorth:
                    projection.projectedNetWorth,


                financialFreedomProgress:
                    projection.financialFreedomProgress

            },


            scenarios:

                this.mapScenarios(
                    projection.scenarios
                ),


            timeline:

                this.mapTimeline(
                    projection.snapshots
                ),


            goals:

                this.mapGoals(
                    projection.goals
                ),


            createdAt:
                projection.createdAt

        };


    }



    /**
     * -------------------------------------------------------
     * Scenario Mapper
     * -------------------------------------------------------
     */

    mapScenarios(
        scenarios
    ) {


        return scenarios.map(

            scenario => ({


                name:
                    scenario.name,


                assumptions: {

                    expectedReturn:
                        scenario.expectedReturn,


                    salaryGrowth:
                        scenario.salaryGrowth,


                    expenseGrowth:
                        scenario.expenseGrowth,


                    savingsGrowth:
                        scenario.savingsGrowth

                },


                confidence:
                    scenario.confidence


            })

        );

    }



    /**
     * -------------------------------------------------------
     * Timeline Mapper
     * -------------------------------------------------------
     */

    mapTimeline(
        snapshots
    ) {


        return snapshots.map(

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
                    item.investments,


                netWorth:
                    item.netWorth,


                cashFlow:
                    item.cashFlow


            })

        );

    }



    /**
     * -------------------------------------------------------
     * Goal Mapper
     * -------------------------------------------------------
     */

    mapGoals(
        goals
    ) {


        return goals.map(

            goal => ({


                name:
                    goal.goalName,


                targetAmount:
                    goal.targetAmount,


                targetYear:
                    goal.targetYear,


                projectedAmount:
                    goal.projectedAmount,


                progress:
                    goal.progress,


                probability:
                    goal.probability,


                status:
                    goal.status


            })

        );

    }



    /**
     * -------------------------------------------------------
     * History Mapper
     * -------------------------------------------------------
     */

    mapHistory(
        history
    ) {


        return history.map(

            item => ({


                id:
                    item.id,


                scenario:
                    item.scenarioType,


                years:
                    item.projectionYears,


                wealthScore:
                    item.wealthScore,


                projectedNetWorth:
                    item.projectedNetWorth,


                createdAt:
                    item.createdAt


            })

        );

    }


}


module.exports =
    new GrowthProjectionResponseMapper();