const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");

const utilityBillController = require("../controllers/utilityBill.controller");

const {
  createUtilityBillValidator,
  updateUtilityBillValidator,
  utilityBillIdValidator,
  listUtilityBillsValidator,
} = require("../validators/utilityBill.validator");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| All Utility Bill Routes Require Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
|
| Must be before "/:id"
|
*/

router.get(
  "/statistics",
  utilityBillController.getUtilityBillStatistics
);

/*
|--------------------------------------------------------------------------
| CRUD
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  createUtilityBillValidator,
  utilityBillController.createUtilityBill
);

router.get(
  "/",
  listUtilityBillsValidator,
  utilityBillController.listUtilityBills
);

router.get(
  "/:id",
  utilityBillIdValidator,
  utilityBillController.getUtilityBill
);

router.patch(
  "/:id",
  [...utilityBillIdValidator, ...updateUtilityBillValidator],
  utilityBillController.updateUtilityBill
);

router.delete(
  "/:id",
  utilityBillIdValidator,
  utilityBillController.deleteUtilityBill
);

module.exports = router;