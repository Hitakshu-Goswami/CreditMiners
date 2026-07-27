class GrowthProjectionValidator {


    validate(data) {


        this.validateFinancialSnapshot(
            data.financialSnapshot
        );


        this.validateBehaviourSignals(
            data.behaviourSignals
        );


        this.validateRiskProfile(
            data.riskProfile
        );


        this.validateGoals(
            data.goals
        );


        return true;

    }



    validateFinancialSnapshot(
        data
    ){

        if(!data)
            throw new Error(
                "Financial snapshot required"
            );


        if(data.monthlyIncome < 0)
            throw new Error(
                "Invalid income"
            );


        if(data.monthlyExpenses < 0)
            throw new Error(
                "Invalid expenses"
            );

    }



    validateBehaviourSignals(
        data
    ){

        if(!data)
            throw new Error(
                "Behaviour signals required"
            );

    }



    validateRiskProfile(
        data
    ){

        if(!data)
            throw new Error(
                "Risk profile required"
            );

    }



    validateGoals(
        goals=[]
    ){

        goals.forEach(goal=>{


            if(
                !goal.name ||
                !goal.targetAmount ||
                !goal.targetYear
            ){

                throw new Error(
                    "Invalid goal format"
                );

            }


        });

    }


}


module.exports =
    new GrowthProjectionValidator();