import { ArrowDownRight, ArrowUpRight, Scale, CalendarDays } from "lucide-react";
import { formatCurrency } from "../utils/format";

const Card = ({ label, value, icon: Icon, tone }) => {
  const toneStyles = {
    income: "text-income bg-income/10",
    expense: "text-expense bg-expense/10",
    brand: "text-brand-600 dark:text-brand-400 bg-brand-500/10",
    neutral: "text-ink dark:text-neutral-200 bg-black/5 dark:bg-white/10",
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 sm:p-5 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted">{label}</span>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${toneStyles[tone]}`}>
          <Icon size={16} strokeWidth={2.25} />
        </span>
      </div>
      <p className="font-display text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
};

const SummaryCards = ({ summary, monthLabel }) => {
  const totalIncome = summary?.totalIncome ?? 0;
  const totalExpense = summary?.totalExpense ?? 0;
  const balance = summary?.balance ?? 0;
  const monthlySpending = summary?.monthlySpending ?? 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card label={`${monthLabel} income`} value={formatCurrency(totalIncome)} icon={ArrowUpRight} tone="income" />
      <Card label={`${monthLabel} expenses`} value={formatCurrency(totalExpense)} icon={ArrowDownRight} tone="expense" />
      <Card label="Monthly balance" value={formatCurrency(balance)} icon={Scale} tone="brand" />
      <Card label="Monthly spending" value={formatCurrency(monthlySpending)} icon={CalendarDays} tone="neutral" />
    </div>
  );
};

export default SummaryCards;
