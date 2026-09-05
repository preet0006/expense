import { Search, Pencil, Trash2, Receipt, Download, X } from "lucide-react";
import { CATEGORIES, CATEGORY_COLORS, formatCurrency, formatDate } from "../utils/format";

const TransactionTable = ({
  transactions,
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  onClearFilters,
  onExport,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-soft overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-border-light dark:border-border-dark flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Receipt size={16} className="text-brand-500" />
          <h2 className="font-display font-semibold text-sm">Transaction history</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search description or category"
              className="pl-8 pr-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-transparent text-sm outline-none focus:border-brand-500 w-full sm:w-56"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-transparent text-sm outline-none focus:border-brand-500"
          >
            <option value="All" className="dark:bg-surface-dark">All types</option>
            <option value="Income" className="dark:bg-surface-dark">Income</option>
            <option value="Expense" className="dark:bg-surface-dark">Expense</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-transparent text-sm outline-none focus:border-brand-500"
          >
            <option value="All" className="dark:bg-surface-dark">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="dark:bg-surface-dark">{c}</option>
            ))}
          </select>
          <button
            onClick={onClearFilters}
            className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border-light dark:border-border-dark text-sm text-muted hover:text-ink dark:hover:text-white transition-colors"
            aria-label="Clear filters"
          >
            <X size={14} />
            <span>Clear</span>
          </button>
          <button
            onClick={onExport}
            disabled={transactions.length === 0}
            className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="py-14 text-center text-sm text-muted">
          No transactions match your filters.
        </div>
      ) : (
        <>
          {/* Table for larger screens */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border-light dark:border-border-dark">
                  <th className="px-5 py-2.5 font-medium">Date</th>
                  <th className="px-5 py-2.5 font-medium">Description</th>
                  <th className="px-5 py-2.5 font-medium">Category</th>
                  <th className="px-5 py-2.5 font-medium">Type</th>
                  <th className="px-5 py-2.5 font-medium text-right">Amount</th>
                  <th className="px-5 py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr
                    key={t._id}
                    className="border-b border-border-light dark:border-border-dark last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-3 whitespace-nowrap text-muted">{formatDate(t.date)}</td>
                    <td className="px-5 py-3 max-w-[220px] truncate">{t.description || "—"}</td>
                    <td className="px-5 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[t.category]}1A`,
                          color: CATEGORY_COLORS[t.category],
                        }}
                      >
                        {t.category}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={t.type === "Income" ? "text-income" : "text-expense"}>{t.type}</span>
                    </td>
                    <td className={`px-5 py-3 text-right font-medium whitespace-nowrap ${t.type === "Income" ? "text-income" : "text-expense"}`}>
                      {t.type === "Income" ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit(t)}
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-muted hover:text-ink dark:hover:text-white transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(t._id)}
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-expense/10 text-muted hover:text-expense transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for mobile */}
          <div className="sm:hidden divide-y divide-border-light dark:divide-border-dark">
            {transactions.map((t) => (
              <div key={t._id} className="p-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{t.description || t.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: `${CATEGORY_COLORS[t.category]}1A`,
                        color: CATEGORY_COLORS[t.category],
                      }}
                    >
                      {t.category}
                    </span>
                    <span className="text-xs text-muted">{formatDate(t.date)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`text-sm font-semibold ${t.type === "Income" ? "text-income" : "text-expense"}`}>
                    {t.type === "Income" ? "+" : "-"}
                    {formatCurrency(t.amount)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onEdit(t)} className="w-7 h-7 flex items-center justify-center rounded-md text-muted" aria-label="Edit">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => onDelete(t._id)} className="w-7 h-7 flex items-center justify-center rounded-md text-muted hover:text-expense" aria-label="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionTable;
