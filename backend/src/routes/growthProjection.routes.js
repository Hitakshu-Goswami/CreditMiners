const express =
    require("express");


const router =
    express.Router();


const growthProjectionController =
    require("../controllers/growthProjection.controller");


const {
    authenticate
} =
require("../middleware/auth.middleware");



/**
 * @swagger
 * tags:
 *   name: Growth Projection
 *   description: AI financial growth forecasting APIs
 */



/**
 * Generate Projection
 */

router.post(

    "/generate",

    authenticate,

    growthProjectionController
        .generateProjection

);



/**
 * Projection History
 */

router.get(

    "/history",

    authenticate,

    growthProjectionController
        .getHistory

);



/**
 * Single Projection
 */

router.get(

    "/:id",

    authenticate,

    growthProjectionController
        .getProjection

);



module.exports =
    router;