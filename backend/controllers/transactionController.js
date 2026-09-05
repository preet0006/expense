import Transaction, { CATEGORIES } from "../models/Transaction.js";
import Budget from "../models/Budget.js";

// Small helper: "2026-09" for the given date (defaults to now)
const monthKey = (date = new Date()) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// @desc    Get all transactions, with optional search + filters
// @route   GET /api/transactions?search=&type=&category=&month=
export const getTransactions = async (req, res) => {
  try {
    const { search, type, category, month } = req.query;
    const query = {};

    if (type && type !== "All") query.type = type;
    if (category && category !== "All") query.category = category;

    if (search) {
      query.$or = [
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (month) {
      // month expected as "YYYY-MM"
      const [year, mon] = month.split("-").map(Number);
      const start = new Date(year, mon - 1, 1);
      const end = new Date(year, mon, 1);
      query.date = { $gte: start, $lt: end };
    }

    const transactions = await Transaction.find(query).sort({ date: -1, createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
  }
};

// @desc    Get a single transaction
// @route   GET /api/transactions/:id
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transaction", error: error.message });
  }
};

// @desc    Create a transaction
// @route   POST /api/transactions
export const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;
    const transaction = await Transaction.create({ amount, type, category, description, date });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: "Failed to create transaction", error: error.message });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: "Failed to update transaction", error: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete transaction", error: error.message });
  }
};

// @desc    Dashboard summary: totals, monthly spend, category breakdown, insights
// @route   GET /api/transactions/summary
export const getSummary = async (req, res) => {
  try {
    const currentMonth = monthKey();
    const selectedMonth = req.query.month || currentMonth;
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(selectedMonth)) {
      return res.status(400).json({ message: "Month must use YYYY-MM format" });
    }

    const all = await Transaction.find({});
    const monthTransactions = all.filter((t) => monthKey(t.date) === selectedMonth);

    const totalIncome = monthTransactions
      .filter((t) => t.type === "Income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = monthTransactions
      .filter((t) => t.type === "Expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    const monthlyExpenses = monthTransactions.filter((t) => t.type === "Expense");
    const monthlySpending = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown (all-time expenses), used for the chart + insights
    const categoryTotals = CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {});
    monthTransactions
      .filter((t) => t.type === "Expense")
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([category, total]) => ({ category, total: Math.round(total * 100) / 100 }))
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total);

    const topCategory = categoryBreakdown[0]?.category || null;

    // Budget progress for the current month
    const budgetDoc = await Budget.findOne({ month: selectedMonth });
    const budgetLimit = budgetDoc?.limit ?? null;
    const budgetPercent =
      budgetLimit && budgetLimit > 0
        ? Math.round((monthlySpending / budgetLimit) * 100)
        : null;

    // Simple rule-based "smart insights"
    const insights = [];
    if (topCategory) {
      insights.push(`You spent the most on ${topCategory}.`);
    }
    if (budgetPercent !== null) {
      if (budgetPercent >= 100) {
        insights.push("You have gone over your monthly budget.");
      } else if (budgetPercent >= 80) {
        insights.push("You are close to your monthly budget.");
      } else if (budgetPercent <= 30) {
        insights.push("You're well within your monthly budget. Nice work.");
      }
    }
    if (balance < 0) {
      insights.push("Your expenses have exceeded your income overall.");
    }
    if (monthlyExpenses.length === 0) {
      insights.push("No expenses recorded yet this month.");
    }

    res.json({
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpense: Math.round(totalExpense * 100) / 100,
      balance: Math.round(balance * 100) / 100,
      monthlySpending: Math.round(monthlySpending * 100) / 100,
      currentMonth: selectedMonth,
      categoryBreakdown,
      budget: budgetLimit !== null ? { limit: budgetLimit, percent: budgetPercent } : null,
      insights,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to build summary", error: error.message });
  }
};
