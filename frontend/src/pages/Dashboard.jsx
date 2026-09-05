import { useEffect, useMemo, useState, useCallback } from "react";
import Topbar from "../components/Topbar";
import SummaryCards from "../components/SummaryCards";
import CategoryChart from "../components/CategoryChart";
import BudgetProgress from "../components/BudgetProgress";
import Insights from "../components/Insights";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";
import {
  fetchTransactions,
  fetchSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  saveBudget,
} from "../api/api";
import { formatMonth } from "../utils/format";

const getCurrentMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadAll = useCallback(async () => {
    try {
      setErrorMsg("");
      const [txs, summaryData] = await Promise.all([
        fetchTransactions({ month: selectedMonth }),
        fetchSummary(selectedMonth),
      ]);
      setTransactions(txs);
      setSummary(summaryData);
    } catch (err) {
      setErrorMsg(
        "Couldn't reach the backend API. Make sure the server is running and VITE_API_URL is set correctly."
      );
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const monthLabel = formatMonth(selectedMonth);
  const clearFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setCategoryFilter("All");
  };

  const exportTransactions = () => {
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const escapeCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const rows = filtered.map((transaction) => [
      transaction.date,
      transaction.description,
      transaction.category,
      transaction.type,
      transaction.amount,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `pocketwise-${selectedMonth}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        !search ||
        t.description?.toLowerCase().includes(search.toLowerCase()) ||
        t.category?.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "All" || t.type === typeFilter;
      const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, search, typeFilter, categoryFilter]);

  const openAddForm = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEditForm = (tx) => {
    setEditing(tx);
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    try {
      if (editing) {
        await updateTransaction(editing._id, payload);
      } else {
        await createTransaction(payload);
      }
      setFormOpen(false);
      setEditing(null);
      await loadAll();
    } catch (err) {
      setErrorMsg("Something went wrong while saving the transaction.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction? This can't be undone.")) return;
    try {
      await deleteTransaction(id);
      await loadAll();
    } catch (err) {
      setErrorMsg("Something went wrong while deleting the transaction.");
    }
  };

  const handleBudgetSave = async (limit) => {
    try {
      await saveBudget({ limit, month: selectedMonth });
      await loadAll();
    } catch (err) {
      setErrorMsg("Something went wrong while saving the budget.");
    }
  };

  return (
    <div className="min-h-screen">
      <Topbar onAddClick={openAddForm} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {errorMsg && (
          <div className="bg-expense/10 border border-expense/30 text-expense text-sm rounded-xl px-4 py-3">
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center text-sm text-muted">Loading your dashboard…</div>
        ) : (
          <>
            <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-brand-500 font-semibold">Financial overview</p>
                <h2 className="font-display text-2xl font-semibold tracking-tight mt-1">{monthLabel}</h2>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="month-select" className="text-sm text-muted">View month</label>
                <input
                  id="month-select"
                  type="month"
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  className="px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-sm outline-none focus:border-brand-500"
                />
                <button
                  onClick={() => setSelectedMonth(getCurrentMonth())}
                  className="px-3 py-2 rounded-lg border border-border-light dark:border-border-dark text-sm text-muted hover:text-ink dark:hover:text-white transition-colors"
                >
                  Today
                </button>
              </div>
            </section>

            <SummaryCards summary={summary} monthLabel={monthLabel} />

            <Insights insights={summary?.insights} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
              <div className="lg:col-span-2">
                <CategoryChart data={summary?.categoryBreakdown} monthLabel={monthLabel} />
              </div>
              <div>
                <BudgetProgress
                  budget={summary?.budget}
                  monthlySpending={summary?.monthlySpending ?? 0}
                  monthLabel={monthLabel}
                  onSave={handleBudgetSave}
                />
              </div>
            </div>

            <TransactionTable
              transactions={filtered}
              search={search}
              onSearchChange={setSearch}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              onClearFilters={clearFilters}
              onExport={exportTransactions}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          </>
        )}
      </main>

      <TransactionForm
        open={formOpen}
        initialData={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <footer className="text-center text-xs text-muted py-8">
        Pocketwise — a small, honest way to track your money.
      </footer>
    </div>
  );
};

export default Dashboard;
