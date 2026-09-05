import express from "express";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
} from "../controllers/transactionController.js";

const router = express.Router();

// Note: /summary must be declared before /:id so it isn't swallowed by the param route
router.get("/summary", getSummary);

router.route("/").get(getTransactions).post(createTransaction);

router
  .route("/:id")
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;
