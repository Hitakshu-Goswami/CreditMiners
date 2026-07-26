const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");

const mobileRechargeController = require("../controllers/mobileRecharge.controller");

const {
  createMobileRechargeValidator,
  updateMobileRechargeValidator,
  mobileRechargeIdValidator,
  listMobileRechargesValidator,
} = require("../validators/mobileRecharge.validator");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| All Mobile Recharge Routes Require Authentication
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
  mobileRechargeController.getMobileRechargeStatistics
);

/*
|--------------------------------------------------------------------------
| CRUD
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  createMobileRechargeValidator,
  mobileRechargeController.createMobileRecharge
);

router.get(
  "/",
  listMobileRechargesValidator,
  mobileRechargeController.listMobileRecharges
);

router.get(
  "/:id",
  mobileRechargeIdValidator,
  mobileRechargeController.getMobileRecharge
);

router.patch(
  "/:id",
  [
    ...mobileRechargeIdValidator,
    ...updateMobileRechargeValidator,
  ],
  mobileRechargeController.updateMobileRecharge
);

router.delete(
  "/:id",
  mobileRechargeIdValidator,
  mobileRechargeController.deleteMobileRecharge
);

module.exports = router;