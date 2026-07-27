const {
    PROJECTION_DURATION,
    INFLATION_RATE
} = require("../constants/growthProjection.constants");

class ForecastingEngine {

    /**
     * -------------------------------------------------------
     * Generate Forecast
     * -------------------------------------------------------
     */

    generateForecast(data) {

        this.validateInput(data);

        const {
            scenario,
            projectionYears,
            financialSnapshot
        } = data;

        const forecast =
            this.initializeForecast(
                scenario,
                projectionYears,
                financialSnapshot
            );

        const years =
    this.getProjectionYears(
        projectionYears
    );

for (let year = 1; year <= years; year++) {
const yearlyForecast =
    this.buildYearFinancialSnapshot(
        forecast.currentFinancials,
        forecast.assumptions,
        year
    );

yearlyForecast.wealth =
    this.buildWealthProjection(
        yearlyForecast,
        forecast,
        year
    );

forecast.yearlyForecasts.push(
    yearlyForecast
);

}
forecast.summary =
    this.buildForecastSummary(
        forecast.yearlyForecasts
    );

forecast.projections =
    this.buildProjectionHighlights(
        forecast.yearlyForecasts
    );

forecast.metrics =
    this.buildForecastMetrics(
        forecast.yearlyForecasts
    );

forecast.timeline =
    this.buildProjectionTimeline(
        forecast.yearlyForecasts
    );
return this.finalizeForecast(
    forecast
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
                "Forecast data is required."
            );

        if (!data.scenario)
            throw new Error(
                "Scenario is required."
            );

        if (!data.financialSnapshot)
            throw new Error(
                "Financial snapshot is required."
            );

        if (!data.projectionYears)
            throw new Error(
                "Projection duration is required."
            );

    }

    /**
     * -------------------------------------------------------
     * Initialize Forecast
     * -------------------------------------------------------
     */

    initializeForecast(
        scenario,
        projectionYears,
        financialSnapshot
    ) {

        return {

            scenario:
                scenario.scenario,

            duration:
                projectionYears,

            assumptions:
                scenario.assumptions,

            currentFinancials: {

                income:
                    Number(
                        financialSnapshot.monthlyIncome || 0
                    ),

                expenses:
                    Number(
                        financialSnapshot.monthlyExpenses || 0
                    ),

                savings:
                    Number(
                        financialSnapshot.monthlySavings || 0
                    ),

                investments:
                    Number(
                        financialSnapshot.totalInvestments || 0
                    ),

                assets:
                    Number(
                        financialSnapshot.totalAssets || 0
                    ),

                liabilities:
                    Number(
                        financialSnapshot.totalLiabilities || 0
                    )

            },

            yearlyForecasts: [],

            summary: {},

            inflationAdjusted: {},

            projections: {},

            metadata: {

                generatedAt:
                    new Date(),

                engine:
                    "ForecastingEngine"

            }

        };

    }

    /**
     * -------------------------------------------------------
     * Get Projection Years
     * -------------------------------------------------------
     */

    getProjectionYears(
        duration
    ) {

        switch (duration) {

            case PROJECTION_DURATION.ONE_YEAR:

                return 1;

            case PROJECTION_DURATION.THREE_YEARS:

                return 3;

            case PROJECTION_DURATION.FIVE_YEARS:

                return 5;

            default:

                return 1;

        }

    }

    /**
     * -------------------------------------------------------
     * Inflation Multiplier
     * -------------------------------------------------------
     */

    getInflationMultiplier(
        year
    ) {

        return Math.pow(

            1 + INFLATION_RATE.DEFAULT,

            year

        );

    }

    /**
     * -------------------------------------------------------
     * Compound Growth
     * -------------------------------------------------------
     */

    compoundGrowth(
        principal,
        rate,
        years
    ) {

        return principal *

            Math.pow(

                1 + rate,

                years

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
 * Project Income
 * -------------------------------------------------------
 */

projectIncome(
    currentIncome,
    salaryGrowth,
    year
) {

    return this.round(

        this.compoundGrowth(

            currentIncome,

            salaryGrowth,

            year

        )

    );

}
/**
 * -------------------------------------------------------
 * Project Expenses
 * -------------------------------------------------------
 */

projectExpenses(
    currentExpenses,
    expenseGrowth,
    year
) {

    return this.round(

        this.compoundGrowth(

            currentExpenses,

            expenseGrowth,

            year

        )

    );

}
/**
 * -------------------------------------------------------
 * Project Savings
 * -------------------------------------------------------
 */

projectSavings(
    currentSavings,
    savingsGrowth,
    year
) {

    return this.round(

        this.compoundGrowth(

            currentSavings,

            savingsGrowth,

            year

        )

    );

}
/**
 * -------------------------------------------------------
 * Monthly Cash Flow
 * -------------------------------------------------------
 */

calculateCashFlow(
    income,
    expenses
) {

    return this.round(

        income -

        expenses

    );

}
/**
 * -------------------------------------------------------
 * Annual Cash Flow
 * -------------------------------------------------------
 */

calculateAnnualCashFlow(
    monthlyCashFlow
) {

    return this.round(

        monthlyCashFlow *

        12

    );

}
/**
 * -------------------------------------------------------
 * Savings Rate
 * -------------------------------------------------------
 */

calculateSavingsRate(
    income,
    savings
) {

    if (!income)
        return 0;

    return this.round(

        this.clamp(

            (savings / income) * 100,

            0,

            100

        )

    );

}
/**
 * -------------------------------------------------------
 * Expense Ratio
 * -------------------------------------------------------
 */

calculateExpenseRatio(
    income,
    expenses
) {

    if (!income)
        return 0;

    return this.round(

        this.clamp(

            (expenses / income) * 100,

            0,

            100

        )

    );

}
/**
 * -------------------------------------------------------
 * Build Year Snapshot
 * -------------------------------------------------------
 */

buildYearFinancialSnapshot(
    financials,
    assumptions,
    year
) {

    const income =
        this.projectIncome(
            financials.income,
            assumptions.salaryGrowth,
            year
        );

    const expenses =
        this.projectExpenses(
            financials.expenses,
            assumptions.expenseGrowth,
            year
        );

    const savings =
        this.projectSavings(
            financials.savings,
            assumptions.savingsGrowth,
            year
        );

    const monthlyCashFlow =
        this.calculateCashFlow(
            income,
            expenses
        );

    return {

        year,

        income,

        expenses,

        savings,

        monthlyCashFlow,

        annualCashFlow:
            this.calculateAnnualCashFlow(
                monthlyCashFlow
            ),

        savingsRate:
            this.calculateSavingsRate(
                income,
                savings
            ),

        expenseRatio:
            this.calculateExpenseRatio(
                income,
                expenses
            )

    };

}
/**
 * -------------------------------------------------------
 * Project Investment Growth
 * -------------------------------------------------------
 */

projectInvestmentGrowth(
    currentInvestment,
    expectedReturn,
    annualContribution,
    year
) {

    const compoundedInvestment =
        this.compoundGrowth(
            currentInvestment,
            expectedReturn,
            year
        );

    const contributionGrowth =
        annualContribution *
        (
            (
                Math.pow(
                    1 + expectedReturn,
                    year
                ) - 1
            ) /
            expectedReturn
        );

    return this.round(

        compoundedInvestment +

        contributionGrowth

    );

}
/**
 * -------------------------------------------------------
 * Inflation Adjusted Value
 * -------------------------------------------------------
 */

calculateInflationAdjustedValue(
    amount,
    year
) {

    return this.round(

        amount /

        this.getInflationMultiplier(
            year
        )

    );

}
/**
 * -------------------------------------------------------
 * Net Worth Projection
 * -------------------------------------------------------
 */

calculateProjectedNetWorth(
    assets,
    investments,
    liabilities
) {

    return this.round(

        assets +

        investments -

        liabilities

    );

}
/**
 * -------------------------------------------------------
 * Project Assets
 * -------------------------------------------------------
 */

projectAssets(
    currentAssets,
    savings,
    investmentGrowth
) {

    return this.round(

        currentAssets +

        savings +

        investmentGrowth

    );

}
/**
 * -------------------------------------------------------
 * Project Liabilities
 * -------------------------------------------------------
 */

projectLiabilities(
    currentLiabilities,
    year
) {

    return this.round(

        currentLiabilities *

        Math.pow(

            0.97,

            year

        )

    );

}
/**
 * -------------------------------------------------------
 * Build Wealth Projection
 * -------------------------------------------------------
 */

buildWealthProjection(
    forecast,
    scenario,
    year
) {

    const annualContribution =
        forecast.savings * 12;

    const investments =
        this.projectInvestmentGrowth(
            scenario.currentFinancials.investments,
            scenario.assumptions.expectedReturn,
            annualContribution,
            year
        );

    const assets =
        this.projectAssets(
            scenario.currentFinancials.assets,
            annualContribution,
            investments
        );

    const liabilities =
        this.projectLiabilities(
            scenario.currentFinancials.liabilities,
            year
        );

    const netWorth =
        this.calculateProjectedNetWorth(
            assets,
            investments,
            liabilities
        );

    return {

        investments,

        assets,

        liabilities,

        netWorth,

        inflationAdjustedNetWorth:
            this.calculateInflationAdjustedValue(
                netWorth,
                year
            )

    };

}
/**
 * -------------------------------------------------------
 * Build Forecast Summary
 * -------------------------------------------------------
 */

buildForecastSummary(
    yearlyForecasts
) {

    const firstYear =
        yearlyForecasts[0];

    const finalYear =
        yearlyForecasts[
            yearlyForecasts.length - 1
        ];

    return {

        projectionYears:
            yearlyForecasts.length,

        initialMonthlyIncome:
            firstYear.income,

        finalMonthlyIncome:
            finalYear.income,

        initialNetWorth:
            firstYear.wealth.netWorth,

        projectedNetWorth:
            finalYear.wealth.netWorth,

        totalInvestment:
            finalYear.wealth.investments,

        inflationAdjustedNetWorth:
            finalYear.wealth
                .inflationAdjustedNetWorth

    };

}
/**
 * -------------------------------------------------------
 * Forecast Metrics
 * -------------------------------------------------------
 */

buildForecastMetrics(
    yearlyForecasts
) {

    const finalYear =
        yearlyForecasts[
            yearlyForecasts.length - 1
        ];

    return {

        averageSavingsRate:

            this.round(

                yearlyForecasts.reduce(

                    (sum, item) =>
                        sum + item.savingsRate,

                    0

                ) /

                yearlyForecasts.length

            ),

        averageExpenseRatio:

            this.round(

                yearlyForecasts.reduce(

                    (sum, item) =>
                        sum + item.expenseRatio,

                    0

                ) /

                yearlyForecasts.length

            ),

        cumulativeSavings:

            this.round(

                yearlyForecasts.reduce(

                    (sum, item) =>

                        sum +

                        (item.savings * 12),

                    0

                )

            ),

        projectedMonthlyCashFlow:

            finalYear.monthlyCashFlow,

        projectedAnnualCashFlow:

            finalYear.annualCashFlow

    };

}
/**
 * -------------------------------------------------------
 * Projection Highlights
 * -------------------------------------------------------
 */

buildProjectionHighlights(
    yearlyForecasts
) {

    const first =
        yearlyForecasts[0];

    const last =
        yearlyForecasts[
            yearlyForecasts.length - 1
        ];

    return {

        incomeGrowth:

            this.round(

                (

                    (
                        last.income -

                        first.income

                    ) /

                    first.income

                ) * 100

            ),

        wealthGrowth:

            this.round(

                (

                    (
                        last.wealth.netWorth -

                        first.wealth.netWorth

                    ) /

                    first.wealth.netWorth

                ) * 100

            ),

        investmentGrowth:

            this.round(

                (

                    (
                        last.wealth.investments -

                        first.wealth.investments

                    ) /

                    first.wealth.investments

                ) * 100

            )

    };

}
/**
 * -------------------------------------------------------
 * Projection Timeline
 * -------------------------------------------------------
 */

buildProjectionTimeline(
    yearlyForecasts
) {

    return yearlyForecasts.map(

        (forecast) => ({

            year:
                forecast.year,

            netWorth:
                forecast.wealth.netWorth,

            investments:
                forecast.wealth.investments,

            savings:
                forecast.savings,

            income:
                forecast.income

        })

    );

}
/**
 * -------------------------------------------------------
 * Validate Forecast
 * -------------------------------------------------------
 */

validateForecast(
    forecast
) {

    if (!forecast.yearlyForecasts.length)
        throw new Error(
            "No yearly forecasts generated."
        );

    forecast.yearlyForecasts.forEach(

        (year) => {

            year.income =
                this.round(
                    Math.max(0, year.income)
                );

            year.expenses =
                this.round(
                    Math.max(0, year.expenses)
                );

            year.savings =
                this.round(
                    Math.max(0, year.savings)
                );

            year.monthlyCashFlow =
                this.round(
                    year.monthlyCashFlow
                );

            year.annualCashFlow =
                this.round(
                    year.annualCashFlow
                );

            year.wealth.netWorth =
                this.round(
                    Math.max(
                        0,
                        year.wealth.netWorth
                    )
                );

            year.wealth.assets =
                this.round(
                    Math.max(
                        0,
                        year.wealth.assets
                    )
                );

            year.wealth.investments =
                this.round(
                    Math.max(
                        0,
                        year.wealth.investments
                    )
                );

            year.wealth.liabilities =
                this.round(
                    Math.max(
                        0,
                        year.wealth.liabilities
                    )
                );

        }

    );

}
/**
 * -------------------------------------------------------
 * Normalize Forecast
 * -------------------------------------------------------
 */

normalizeForecast(
    forecast
) {

    forecast.summary = {

        ...forecast.summary

    };

    forecast.metrics = {

        ...forecast.metrics

    };

    forecast.projections = {

        ...forecast.projections

    };

    return forecast;

}
/**
 * -------------------------------------------------------
 * Attach Metadata
 * -------------------------------------------------------
 */

attachMetadata(
    forecast
) {

    forecast.metadata = {

        ...forecast.metadata,

        version: 1,

        generatedAt:
            new Date(),

        engine:
            "ForecastingEngine",

        totalYears:
            forecast.yearlyForecasts.length

    };

    return forecast;

}
/**
 * -------------------------------------------------------
 * Finalize Forecast
 * -------------------------------------------------------
 */

finalizeForecast(
    forecast
) {

    this.validateForecast(
        forecast
    );

    this.normalizeForecast(
        forecast
    );

    this.attachMetadata(
        forecast
    );

    return Object.freeze(
        forecast
    );

}


}

module.exports =
    new ForecastingEngine();