const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");

const transactionController = require("../controllers/transaction.controller");

const {
  createTransactionValidator,
  updateTransactionValidator,
  transactionIdValidator,
  listTransactionsValidator,
} = require("../validators/transaction.validator");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| All Transaction Routes Require Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

router.post(
  "/",
  createTransactionValidator,
  transactionController.createTransaction
);

router.get(
  "/",
  listTransactionsValidator,
  transactionController.listTransactions
);

router.get(
  "/:id",
  transactionIdValidator,
  transactionController.getTransaction
);

router.patch(
  "/:id",
  [...transactionIdValidator, ...updateTransactionValidator],
  transactionController.updateTransaction
);

router.delete(
  "/:id",
  transactionIdValidator,
  transactionController.deleteTransaction
);

module.exports = router;
