const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");

const upload = require("../middleware/upload.middleware");

const loanMediaController = require("../controllers/loanMedia.controller");

const {
  loanIdValidator,
  mediaIdValidator,
  uploadMediaValidator,
} = require("../validators/loanMedia.validator");

const router = express.Router();

router.use(authenticate);

router.post(
  "/loans/:loanId/media",
  upload.array("files", 10),
  loanIdValidator,
  uploadMediaValidator,
  loanMediaController.uploadMedia
);

router.get(
  "/loans/:loanId/media",
  loanIdValidator,
  loanMediaController.getLoanMedia
);

router.delete(
  "/media/:mediaId",
  mediaIdValidator,
  loanMediaController.deleteMedia
);

router.patch(
  "/media/:mediaId/cover",
  mediaIdValidator,
  loanMediaController.setCoverImage
);

module.exports = router;