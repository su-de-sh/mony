"use client";
import { CATEGORIES } from "@/constants/categories";
import PieChartWidget from "@/sections/analytics/PieChartWidget";
import { useAppContext } from "@/contexts";
import { useTransaction } from "@/hooks/useTransaction";

const Analytics = () => {
  const { currentMonth } = useAppContext();

  const { data: transactionForCurrentMonth } = useTransaction(currentMonth);
  const darkMode = false;

  const getCategoryTotal = (categoryName) => {
    return (
      transactionForCurrentMonth
        ?.filter(
          (t) =>
            t.category.name === categoryName && t.transactionType === "EXPENSE"
        )
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0
    );
  };

  const chartData = CATEGORIES.map((category) => ({
    name: category.name,
    value: getCategoryTotal(category.name),
    color: category.color,
  })).filter((item) => item.value > 0);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-xl shadow-lg p-6 mb-8`}
    >
      <h2
        className={`text-xl font-semibold ${
          darkMode ? "text-orange-400" : "text-orange-600"
        } mb-4`}
      >
        Expense Breakdown
      </h2>
      <div
        className="flex items-center justify-center"
        style={{ height: "300px" }}
      >
        {chartData.length > 0 && <PieChartWidget chartData={chartData} />}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {CATEGORIES.map((category) => {
          const total = getCategoryTotal(category.name);
          if (total === 0) return null;
          const Icon = category.icon;
          return (
            <div
              key={category.name}
              className={`flex items-center justify-between ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              } p-2 rounded-xl`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: category.color }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col max-w-20">
                  <span className="font-medium truncate">{category.name}</span>
                  <span className="font-semibold text-xs">
                    ${Number(total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Analytics;
