const growthProjectionService =
    require("../services/growthProjection.service");


class GrowthProjectionController {


    /**
     * -------------------------------------------------------
     * Generate Growth Projection
     * -------------------------------------------------------
     */

    async generateProjection(
        req,
        res,
        next
    ) {

        try {


            const userId =
                req.user.id;


            const {

                financialSnapshot,

                behaviourSignals,

                riskProfile,

                goals,

                projectionYears

            } = req.body;



            const input =
                growthProjectionService.prepareInput(

                    financialSnapshot,

                    behaviourSignals,

                    riskProfile,

                    goals,

                    projectionYears

                );



            const result =
                await growthProjectionService
.generateGrowthProjection(

    userId,

    input

);



            return res.status(200).json({

                success: true,

                userId,

                data: result

            });


        }
        catch(error) {

            next(error);

        }

    }



    /**
     * -------------------------------------------------------
     * Get Projection History
     * -------------------------------------------------------
     */

   async getHistory(
    req,
    res,
    next
) {

    try {


        const userId =
            req.user.id;


        const history =
            await growthProjectionService
                .getProjectionHistory(
                    userId
                );


        return res.status(200).json({

            success:true,

            data:history

        });


    }
    catch(error){

        next(error);

    }

}



    /**
     * -------------------------------------------------------
     * Get Single Projection
     * -------------------------------------------------------
     */

    async getProjection(
    req,
    res,
    next
) {

    try {


        const userId =
            req.user.id;


        const {
            id
        } = req.params;


        const projection =
            await growthProjectionService
                .getProjectionDetails(

                    id,

                    userId

                );


        if(!projection){

            return res.status(404).json({

                success:false,

                message:
                    "Projection not found."

            });

        }


        return res.status(200).json({

            success:true,

            data:projection

        });


    }
    catch(error){

        next(error);

    }

}


}


module.exports =
    new GrowthProjectionController();