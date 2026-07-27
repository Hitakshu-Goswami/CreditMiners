const winston = require("winston");

const logger = winston.createLogger({

    level: "info",

    format: winston.format.combine(

        winston.format.timestamp({

            format:
                "YYYY-MM-DD HH:mm:ss"

        }),

        winston.format.errors({

            stack: true

        }),

        winston.format.json()

    ),


    transports: [

        new winston.transports.File({

            filename:
                "logs/error.log",

            level:
                "error"

        }),


        new winston.transports.File({

            filename:
                "logs/combined.log"

        })

    ]

});


// Development console logging
if(
    process.env.NODE_ENV !== "production"
) {

    logger.add(

        new winston.transports.Console({

            format:

                winston.format.combine(

                    winston.format.colorize(),

                    winston.format.simple()

                )

        })

    );

}


// Phase 8 helper methods
logger.logProjectionError = function(
    error,
    metadata = {}
) {

    logger.error({

        message:
            "Growth Projection Error",

        error:
            error.message,

        stack:
            error.stack,

        ...metadata

    });

};


logger.logProjectionInfo = function(
    message,
    metadata = {}
) {

    logger.info({

        message,

        ...metadata

    });

};


module.exports = logger;