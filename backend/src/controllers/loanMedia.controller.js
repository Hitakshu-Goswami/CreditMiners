const asyncHandler = require("../middleware/async.middleware");

const response = require("../utils/response");

const { validationResult } = require("express-validator");

const BadRequestError = require("../errors/BadRequestError");

const loanMediaService = require("../services/loanMedia.service");

const validateRequest = (req) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError(errors.array()[0].msg);
  }
};

const contextFrom = (req) => ({
  ipAddress: req.ip,
  userAgent: req.get("user-agent"),
});

const uploadMedia = asyncHandler(async (req, res) => {
  validateRequest(req);

  const media = await loanMediaService.uploadMedia(
    req.user.id,
    req.params.loanId,
    req.files,
    req.body,
    contextFrom(req)
  );

  response.success(res, media, "Media uploaded successfully.");
});

const getLoanMedia = asyncHandler(async (req, res) => {
  validateRequest(req);

  const media = await loanMediaService.getLoanMedia(
    req.params.loanId
  );

  response.success(res, media);
});

const deleteMedia = asyncHandler(async (req, res) => {
  validateRequest(req);

  await loanMediaService.deleteMedia(
    req.user.id,
    req.params.mediaId,
    contextFrom(req)
  );

  response.success(res, null, "Media deleted successfully.");
});

const setCoverImage = asyncHandler(async (req, res) => {
  validateRequest(req);

  const media = await loanMediaService.setCoverImage(
    req.user.id,
    req.params.mediaId,
    contextFrom(req)
  );

  response.success(
    res,
    media,
    "Cover image updated successfully."
  );
});

module.exports = {
  uploadMedia,
  getLoanMedia,
  deleteMedia,
  setCoverImage,
};