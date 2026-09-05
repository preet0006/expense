import { useEffect, useState } from "react";
import { Target, Pencil } from "lucide-react";
import { formatCurrency } from "../utils/format";

const BudgetProgress = ({ budget, monthlySpending, monthLabel, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(budget?.limit ?? "");

  useEffect(() => {
    setValue(budget?.limit ?? "");
    setEditing(false);
  }, [budget?.limit]);

  const percent = budget?.percent ?? (budget?.limit ? Math.round((monthlySpending / budget.limit) * 100) : 0);
  const clamped = Math.min(percent ?? 0, 100);

  const barColor =
    percent >= 100 ? "bg-expense" : percent >= 80 ? "bg-amber-500" : "bg-brand-500";

  const submit = (e) => {
    e.preventDefault();
    if (!value || Number(value) < 0) return;
    onSave(Number(value));
    setEditing(false);
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 sm:p-5 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-brand-500" />
          <h2 className="font-display font-semibold text-sm">{monthLabel} budget</h2>
        </div>
        <button
          onClick={() => {
            setValue(budget?.limit ?? "");
            setEditing((e) => !e);
          }}
          className="text-muted hover:text-ink dark:hover:text-white transition-colors"
          aria-label="Edit budget"
        >
          <Pencil size={14} />
        </button>
      </div>

      {editing ? (
        <form onSubmit={submit} className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            step="1"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Set monthly limit"
            className="flex-1 px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-transparent text-sm outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
          >
            Save
          </button>
        </form>
      ) : budget?.limit ? (
        <>
          <div className="flex items-end justify-between mb-2">
            <span className="font-display text-xl font-semibold">{formatCurrency(monthlySpending)}</span>
            <span className="text-xs text-muted">of {formatCurrency(budget.limit)}</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full ${barColor} transition-all duration-500`}
              style={{ width: `${clamped}%` }}
            />
          </div>
          <p className="text-xs text-muted mt-2">
            {percent >= 100
              ? `${percent}% used — you're over budget`
              : `${percent}% of ${monthLabel.toLowerCase()} budget used`}
          </p>
        </>
      ) : (
        <p className="text-sm text-muted">
          No budget set yet. Click the pencil icon to set a monthly limit.
        </p>
      )}
    </div>
  );
};

export default BudgetProgress;
