const logger =
require("../utils/logger");


module.exports = (

    error,

    req,

    res,

    next

)=>{


    logger.error(

        "API Error",

        error

    );


    return res.status(
        500
    )
    .json({

        success:false,

        message:
            error.message ||
            "Internal Server Error"

    });


};