import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import { CATEGORY_COLORS, formatCurrency } from "../utils/format";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { category, total } = payload[0].payload;
  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm shadow-soft">
      <p className="font-medium">{category}</p>
      <p className="text-muted">{formatCurrency(total)}</p>
    </div>
  );
};

const CategoryChart = ({ data, monthLabel }) => {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 sm:p-5 shadow-soft h-full flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <PieIcon size={16} className="text-brand-500" />
        <h2 className="font-display font-semibold text-sm">Spending by category</h2>
      </div>
      <p className="text-xs text-muted mb-3">Expense breakdown for {monthLabel}</p>

      {hasData ? (
        <div className="flex-1 min-h-[220px]">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="category"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || "#8A8F87"} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-muted py-10">
          Add an expense to see your breakdown here.
        </div>
      )}
    </div>
  );
};

export default CategoryChart;
