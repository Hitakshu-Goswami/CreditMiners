const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");

const ecommerceOrderController = require("../controllers/ecommerceOrder.controller");

const {
  createEcommerceOrderValidator,
  updateEcommerceOrderValidator,
  ecommerceOrderIdValidator,
  listEcommerceOrdersValidator,
} = require("../validators/ecommerceOrder.validator");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(
  "/statistics",
  ecommerceOrderController.getEcommerceOrderStatistics
);

/*
|--------------------------------------------------------------------------
| CRUD
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  createEcommerceOrderValidator,
  ecommerceOrderController.createEcommerceOrder
);

router.get(
  "/",
  listEcommerceOrdersValidator,
  ecommerceOrderController.listEcommerceOrders
);

router.get(
  "/:id",
  ecommerceOrderIdValidator,
  ecommerceOrderController.getEcommerceOrder
);

router.patch(
  "/:id",
  [
    ...ecommerceOrderIdValidator,
    ...updateEcommerceOrderValidator,
  ],
  ecommerceOrderController.updateEcommerceOrder
);

router.delete(
  "/:id",
  ecommerceOrderIdValidator,
  ecommerceOrderController.deleteEcommerceOrder
);

module.exports = router;