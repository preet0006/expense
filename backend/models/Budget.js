import mongoose from "mongoose";

// One budget document per calendar month, e.g. month: "2026-09"
const budgetSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{4}-\d{2}$/, "month must be in YYYY-MM format"],
    },
    limit: {
      type: Number,
      required: [true, "Budget limit is required"],
      min: [0, "Budget limit cannot be negative"],
    },
  },
  { timestamps: true }
);

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
