import Budget from "../models/Budget.js";

const monthKey = (date = new Date()) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// @desc    Get the budget for a given month (defaults to current month)
// @route   GET /api/budget?month=YYYY-MM
export const getBudget = async (req, res) => {
  try {
    const month = req.query.month || monthKey();
    const budget = await Budget.findOne({ month });
    res.json(budget || { month, limit: null });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch budget", error: error.message });
  }
};

// @desc    Create or update the budget for a month (upsert)
// @route   PUT /api/budget
// @body    { month?: "YYYY-MM", limit: number }
export const setBudget = async (req, res) => {
  try {
    const { limit } = req.body;
    const month = req.body.month || monthKey();

    if (limit === undefined || limit === null || Number(limit) < 0) {
      return res.status(400).json({ message: "A valid non-negative limit is required" });
    }

    const budget = await Budget.findOneAndUpdate(
      { month },
      { month, limit: Number(limit) },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(budget);
  } catch (error) {
    res.status(400).json({ message: "Failed to save budget", error: error.message });
  }
};
