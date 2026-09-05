import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CATEGORIES } from "../utils/format";

const emptyForm = {
  amount: "",
  type: "Expense",
  category: "Food",
  description: "",
  date: new Date().toISOString().slice(0, 10),
};

const TransactionForm = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        amount: initialData.amount,
        type: initialData.type,
        category: initialData.category,
        description: initialData.description || "",
        date: new Date(initialData.date).toISOString().slice(0, 10),
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4">
      <div className="bg-surface-light dark:bg-surface-dark w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 shadow-soft border border-border-light dark:border-border-dark">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg">
            {initialData ? "Edit transaction" : "Add transaction"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2">
            {["Expense", "Income"].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                  form.type === t
                    ? t === "Income"
                      ? "bg-income/10 border-income text-income"
                      : "bg-expense/10 border-expense text-expense"
                    : "border-border-light dark:border-border-dark text-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs text-muted mb-1 block">Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={handleChange("amount")}
              placeholder="0.00"
              className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-transparent outline-none focus:border-brand-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={handleChange("category")}
                className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-transparent outline-none focus:border-brand-500 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="dark:bg-surface-dark">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={handleChange("date")}
                className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-transparent outline-none focus:border-brand-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted mb-1 block">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={handleChange("description")}
              placeholder="e.g. Grocery run"
              maxLength={200}
              className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-transparent outline-none focus:border-brand-500 text-sm"
            />
          </div>

          {error && <p className="text-sm text-expense">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-border-light dark:border-border-dark text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
            >
              {initialData ? "Save changes" : "Add transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
