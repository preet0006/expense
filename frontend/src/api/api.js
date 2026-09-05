import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Transactions
export const fetchTransactions = (params = {}) =>
  api.get("/transactions", { params }).then((res) => res.data);

export const fetchSummary = (month) =>
  api.get("/transactions/summary", { params: month ? { month } : {} }).then((res) => res.data);

export const createTransaction = (payload) =>
  api.post("/transactions", payload).then((res) => res.data);

export const updateTransaction = (id, payload) =>
  api.put(`/transactions/${id}`, payload).then((res) => res.data);

export const deleteTransaction = (id) =>
  api.delete(`/transactions/${id}`).then((res) => res.data);

// Budget
export const fetchBudget = (month) =>
  api.get("/budget", { params: month ? { month } : {} }).then((res) => res.data);

export const saveBudget = (payload) => api.put("/budget", payload).then((res) => res.data);

export default api;
