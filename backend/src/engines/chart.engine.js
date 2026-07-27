class ChartEngine {


    /**
     * -------------------------------------------------------
     * Generate Charts
     * -------------------------------------------------------
     */

    generateCharts(data) {

        this.validateInput(data);


        const {
            growthProjection
        } = data;


        return {

            netWorthChart:
                this.buildNetWorthChart(
                    growthProjection
                ),


            investmentChart:
                this.buildInvestmentChart(
                    growthProjection
                ),


            cashFlowChart:
                this.buildCashFlowChart(
                    growthProjection
                ),


            scenarioComparison:
                this.buildScenarioComparison(
                    growthProjection
                ),


            goalProgressChart:
                this.buildGoalProgressChart(
                    growthProjection
                ),


            metadata: {

                generatedAt:
                    new Date(),

                engine:
                    "ChartEngine"

            }

        };

    }



    /**
     * -------------------------------------------------------
     * Validate Input
     * -------------------------------------------------------
     */

    validateInput(data) {

        if(!data)

            throw new Error(
                "Chart data is required."
            );


        if(!data.growthProjection)

            throw new Error(
                "Growth projection is required."
            );

    }



    /**
     * -------------------------------------------------------
     * Net Worth Chart
     * -------------------------------------------------------
     */

    buildNetWorthChart(
        projection
    ) {


        const moderate =
            projection
                .scenarios
                .moderate;


        return moderate
            .forecast
            .timeline
            ?.map(

                item => ({

                    year:
                        item.year,

                    value:
                        item.netWorth

                })

            ) || [];

    }



    /**
     * -------------------------------------------------------
     * Investment Chart
     * -------------------------------------------------------
     */

    buildInvestmentChart(
        projection
    ) {


        const moderate =
            projection
                .scenarios
                .moderate;


        return moderate
            .forecast
            .timeline
            ?.map(

                item => ({

                    year:
                        item.year,

                    value:
                        item.investments

                })

            ) || [];

    }



    /**
     * -------------------------------------------------------
     * Cash Flow Chart
     * -------------------------------------------------------
     */

    buildCashFlowChart(
        projection
    ) {


        const moderate =
            projection
                .scenarios
                .moderate;


        return moderate
            .forecast
            .yearlyForecasts
            ?.map(

                item => ({

                    year:
                        item.year,

                    income:
                        item.income,

                    expenses:
                        item.expenses,

                    savings:
                        item.savings

                })

            ) || [];

    }



    /**
     * -------------------------------------------------------
     * Scenario Comparison Chart
     * -------------------------------------------------------
     */

    buildScenarioComparison(
        projection
    ) {


        return Object.keys(
            projection.comparison
        )
        .map(

            scenario => ({

                scenario,

                wealthScore:

                    projection
                    .comparison[scenario]
                    .wealthScore,


                netWorth:

                    projection
                    .comparison[scenario]
                    .projectedNetWorth

            })

        );

    }



    /**
     * -------------------------------------------------------
     * Goal Progress Chart
     * -------------------------------------------------------
     */

    buildGoalProgressChart(
        projection
    ) {


        const moderate =
            projection
                .scenarios
                .moderate;


        return moderate
            .goalProjection
            .analyzedGoals
            ?.map(

                goal => ({

                    name:
                        goal.name,

                    progress:
                        goal.progress

                })

            ) || [];

    }



}


module.exports =
    new ChartEngine();