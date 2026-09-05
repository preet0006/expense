import { Sparkles } from "lucide-react";

const Insights = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 rounded-xl p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-brand-600 dark:text-brand-400" />
        <h2 className="font-display font-semibold text-sm text-brand-700 dark:text-brand-400">
          Smart insights
        </h2>
      </div>
      <ul className="space-y-1.5">
        {insights.map((tip, i) => (
          <li key={i} className="text-sm text-ink dark:text-neutral-200 flex gap-2">
            <span className="text-brand-500 mt-0.5">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Insights;
