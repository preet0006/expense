import express from "express";
import { getBudget, setBudget } from "../controllers/budgetController.js";

const router = express.Router();

router.route("/").get(getBudget).put(setBudget);

export default router;
