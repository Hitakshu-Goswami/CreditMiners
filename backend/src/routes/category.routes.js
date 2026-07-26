const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");

const controller = require("../controllers/category.controller");

const {

  createCategoryValidator,

  updateCategoryValidator,

  categoryIdValidator,

  listCategoriesValidator,

} = require("../validators/category.validator");

const router = express.Router();

router.use(authenticate);

router.get(
  "/statistics",
  controller.getCategoryStatistics
);

router.post(
  "/",
  createCategoryValidator,
  controller.createCategory
);

router.get(
  "/",
  listCategoriesValidator,
  controller.listCategories
);

router.get(
  "/:id",
  categoryIdValidator,
  controller.getCategory
);

router.patch(
  "/:id",
  [
    ...categoryIdValidator,
    ...updateCategoryValidator,
  ],
  controller.updateCategory
);

router.delete(
  "/:id",
  categoryIdValidator,
  controller.deleteCategory
);

module.exports = router;