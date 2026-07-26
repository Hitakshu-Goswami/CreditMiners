const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/async.middleware");

const response = require("../utils/response");

const BadRequestError = require("../errors/BadRequestError");

const merchantService = require("../services/merchant.service");

const validateRequest = (req) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    throw new BadRequestError(

      errors.array().map(error => error.msg).join(", ")

    );

  }

};

const contextFrom = (req) => ({

  ipAddress: req.ip,

  userAgent: req.headers["user-agent"],

});

exports.createMerchant = asyncHandler(async (req, res) => {

  validateRequest(req);

  const merchant =
    await merchantService.createMerchant(
      req.body,
      contextFrom(req)
    );

  response.success(

    res,

    "Merchant created successfully.",

    merchant,

    201

  );

});

exports.listMerchants = asyncHandler(async (req, res) => {

  validateRequest(req);

  const merchants =
    await merchantService.listMerchants(
      req.query
    );

  response.success(

    res,

    "Merchants fetched successfully.",

    merchants

  );

});

exports.getMerchant = asyncHandler(async (req, res) => {

  validateRequest(req);

  const merchant =
    await merchantService.getMerchant(
      req.params.id
    );

  response.success(

    res,

    "Merchant fetched successfully.",

    merchant

  );

});

exports.updateMerchant = asyncHandler(async (req, res) => {

  validateRequest(req);

  const merchant =
    await merchantService.updateMerchant(

      req.params.id,

      req.body,

      contextFrom(req)

    );

  response.success(

    res,

    "Merchant updated successfully.",

    merchant

  );

});

exports.deleteMerchant = asyncHandler(async (req, res) => {

  validateRequest(req);

  await merchantService.deleteMerchant(

    req.params.id,

    contextFrom(req)

  );

  response.success(

    res,

    "Merchant deleted successfully."

  );

});

exports.getMerchantStatistics = asyncHandler(async (req, res) => {

  const statistics =
    await merchantService.getMerchantStatistics();

  response.success(

    res,

    "Merchant statistics fetched successfully.",

    statistics

  );

});