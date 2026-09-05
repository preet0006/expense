// Seeds the database with realistic fake transactions + a current-month budget.
// Run with: npm run seed

import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";

dotenv.config();

const monthKey = (date = new Date()) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// Build a date N days ago from today, keeping current month/last month mixed
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

const sample = [
  // Income
  { amount: 55000, type: "Income", category: "Other", description: "Monthly salary", date: daysAgo(35) },
  { amount: 55000, type: "Income", category: "Other", description: "Monthly salary", date: daysAgo(5) },
  { amount: 4200, type: "Income", category: "Other", description: "Freelance web project", date: daysAgo(20) },
  { amount: 800, type: "Income", category: "Other", description: "Cashback reward", date: daysAgo(12) },

  // Food
  { amount: 650, type: "Expense", category: "Food", description: "Grocery run - BigBasket", date: daysAgo(2) },
  { amount: 320, type: "Expense", category: "Food", description: "Dinner with friends", date: daysAgo(4) },
  { amount: 180, type: "Expense", category: "Food", description: "Coffee & snacks", date: daysAgo(6) },
  { amount: 540, type: "Expense", category: "Food", description: "Weekly groceries", date: daysAgo(9) },
  { amount: 275, type: "Expense", category: "Food", description: "Lunch orders", date: daysAgo(11) },
  { amount: 410, type: "Expense", category: "Food", description: "Grocery run", date: daysAgo(28) },
  { amount: 300, type: "Expense", category: "Food", description: "Takeout pizza", date: daysAgo(33) },

  // Transport
  { amount: 200, type: "Expense", category: "Transport", description: "Fuel top-up", date: daysAgo(3) },
  { amount: 150, type: "Expense", category: "Transport", description: "Cab rides", date: daysAgo(7) },
  { amount: 90, type: "Expense", category: "Transport", description: "Metro card recharge", date: daysAgo(14) },
  { amount: 220, type: "Expense", category: "Transport", description: "Fuel top-up", date: daysAgo(30) },

  // Shopping
  { amount: 1899, type: "Expense", category: "Shopping", description: "New running shoes", date: daysAgo(8) },
  { amount: 749, type: "Expense", category: "Shopping", description: "Home decor", date: daysAgo(15) },
  { amount: 2200, type: "Expense", category: "Shopping", description: "Winter jacket", date: daysAgo(22) },

  // Bills
  { amount: 1200, type: "Expense", category: "Bills", description: "Electricity bill", date: daysAgo(10) },
  { amount: 599, type: "Expense", category: "Bills", description: "Internet subscription", date: daysAgo(13) },
  { amount: 450, type: "Expense", category: "Bills", description: "Mobile recharge", date: daysAgo(18) },
  { amount: 1200, type: "Expense", category: "Bills", description: "Electricity bill", date: daysAgo(40) },

  // Entertainment
  { amount: 499, type: "Expense", category: "Entertainment", description: "Streaming subscription", date: daysAgo(1) },
  { amount: 650, type: "Expense", category: "Entertainment", description: "Movie night", date: daysAgo(16) },
  { amount: 300, type: "Expense", category: "Entertainment", description: "Concert tickets", date: daysAgo(25) },

  // Health
  { amount: 850, type: "Expense", category: "Health", description: "Pharmacy", date: daysAgo(5) },
  { amount: 1500, type: "Expense", category: "Health", description: "Dentist visit", date: daysAgo(19) },
  { amount: 600, type: "Expense", category: "Health", description: "Gym membership", date: daysAgo(29) },

  // Other
  { amount: 350, type: "Expense", category: "Other", description: "Gift for a friend", date: daysAgo(6) },
  { amount: 500, type: "Expense", category: "Other", description: "Donation", date: daysAgo(23) },
];

const run = async () => {
  await connectDB();

  await Transaction.deleteMany({});
  await Budget.deleteMany({});

  await Transaction.insertMany(sample);
  await Budget.create({ month: monthKey(), limit: 15000 });

  console.log(`Seeded ${sample.length} transactions and a budget for ${monthKey()}.`);
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
