import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

const IncomeExpenseWidget = ({
  darkMode = false,
  currentMonth,
  changeMonth,
}) => {
  const { data: income } = useQuery({
    queryKey: ["income", currentMonth],
    queryFn: () =>
      fetch(`/api/transactions/income?currentMonth=${currentMonth}`, {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json()),
  });

  const { data: expenses } = useQuery({
    queryKey: ["expenses", currentMonth],
    queryFn: () =>
      fetch(`/api/transactions/expenses?currentMonth=${currentMonth}`, {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json()),
  });

  const totalIncome =
    income?.reduce((acc, item) => acc + Number(item.amount), 0) || 0;
  const totalExpenses =
    expenses?.reduce((acc, item) => acc + Number(item.amount), 0) || 0;

  const balance = totalIncome - totalExpenses;

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-xl shadow-lg p-6 mb-8`}
    >
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className={`${
            darkMode
              ? "text-orange-400 hover:bg-gray-700"
              : "text-orange-600 hover:bg-orange-100"
          } p-2 rounded-full transition-colors`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2
          className={`text-xl font-semibold ${
            darkMode ? "text-orange-400" : "text-orange-600"
          }`}
        >
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className={`${
            darkMode
              ? "text-orange-400 hover:bg-gray-700"
              : "text-orange-600 hover:bg-orange-100"
          } p-2 rounded-full transition-colors`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      {
        <div>
          <p
            className={`font-bold text-4xl ${
              darkMode ? "text-white" : "text-gray-800"
            } mb-4`}
          >
            ${balance?.toFixed(2)}
          </p>
          <div className="flex justify-between">
            <div>
              <p
                className={`text-sm  ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Income
              </p>
              <p className="text-lg font-semibold text-green-500">
                ${totalIncome?.toFixed(2)}
              </p>
            </div>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Expenses
              </p>
              <p className="text-lg font-semibold text-red-500">
                ${totalExpenses?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default IncomeExpenseWidget;
