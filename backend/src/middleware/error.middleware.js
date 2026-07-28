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

    const statusCode =
        error.statusCode ||
        500;


    return res.status(
        statusCode
    )
    .json({

        success:false,

        message:
            error.message ||
            "Internal Server Error",

        status:
            error.status ||
            "error"

    });


};
