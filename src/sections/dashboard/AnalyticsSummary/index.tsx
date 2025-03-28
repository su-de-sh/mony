"use client";
import { CATEGORIES } from "@/constants/categories";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const AnalyticsSummary = ({ darkMode = false, transactionForCurrentMonth }) => {
  const router = useRouter();

  if (!transactionForCurrentMonth) {
    return (
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-xl shadow-lg p-4 mb-0 h-full`}
      >
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
        <p className="ml-3 text-gray-500">Loading data...</p>
      </div>
    );
  }

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

  // Get top 3 expense categories
  const topCategories = CATEGORIES.filter(
    (category) => category.type === "EXPENSE"
  )
    .map((category) => ({
      name: category.name,
      value: getCategoryTotal(category.name),
      icon: category.icon,
      color: category.color,
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  const totalExpenses =
    transactionForCurrentMonth
      ?.filter((item) => item.transactionType === "EXPENSE")
      .reduce((acc, item) => acc + Number(item.amount), 0) || 0;

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-xl shadow-lg p-6 h-full flex flex-col`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`text-xl font-semibold ${
            darkMode ? "text-orange-400" : "text-orange-600"
          }`}
        >
          Top Expenses
        </h2>
        <Button
          variant="ghost"
          className="text-orange-500 p-0 h-auto hover:bg-transparent hover:text-orange-700"
          onClick={() => router.push("/dashboard/analytics")}
        >
          View All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {topCategories.length > 0 ? (
        <div className="space-y-4 flex-grow">
          {topCategories.map((category) => {
            const Icon = category.icon;
            const percentage = (category.value / totalExpenses) * 100;

            return (
              <div key={category.name} className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p
                      className={`font-medium truncate ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {category.name}
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      ${category.value.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center flex-col text-center py-4">
          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            No expense data available for this month
          </p>
          <Button
            className="mt-3 bg-orange-500 hover:bg-orange-600"
            onClick={() => router.push("/dashboard/analytics")}
          >
            View Analytics
          </Button>
        </div>
      )}
    </div>
  );
};

export default AnalyticsSummary;
