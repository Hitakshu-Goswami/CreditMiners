const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");

const controller = require("../controllers/merchant.controller");

const {

  createMerchantValidator,

  updateMerchantValidator,

  merchantIdValidator,

  listMerchantsValidator,

} = require("../validators/merchant.validator");

const router = express.Router();

router.use(authenticate);

router.get(
  "/statistics",
  controller.getMerchantStatistics
);

router.post(
  "/",
  createMerchantValidator,
  controller.createMerchant
);

router.get(
  "/",
  listMerchantsValidator,
  controller.listMerchants
);

router.get(
  "/:id",
  merchantIdValidator,
  controller.getMerchant
);

router.patch(
  "/:id",
  [
    ...merchantIdValidator,
    ...updateMerchantValidator,
  ],
  controller.updateMerchant
);

router.delete(
  "/:id",
  merchantIdValidator,
  controller.deleteMerchant
);

module.exports = router;