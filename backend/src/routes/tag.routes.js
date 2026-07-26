const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");

const controller = require("../controllers/tag.controller");

const {

  createTagValidator,

  updateTagValidator,

  tagIdValidator,

  listTagsValidator,

} = require("../validators/tag.validator");

const router = express.Router();

router.use(authenticate);

router.get(
  "/statistics",
  controller.getTagStatistics
);

router.post(
  "/",
  createTagValidator,
  controller.createTag
);

router.get(
  "/",
  listTagsValidator,
  controller.listTags
);

router.get(
  "/:id",
  tagIdValidator,
  controller.getTag
);

router.patch(
  "/:id",
  [
    ...tagIdValidator,
    ...updateTagValidator,
  ],
  controller.updateTag
);

router.delete(
  "/:id",
  tagIdValidator,
  controller.deleteTag
);

module.exports = router;