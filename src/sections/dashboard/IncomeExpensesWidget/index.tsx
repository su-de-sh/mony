"use client";
import { useAppContext } from "@/contexts";
import { ChevronLeft, ChevronRight, PlusCircle, BarChart } from "lucide-react";
import { useEffect, useState } from "react";
import usePreviousMonthData from "@/hooks/usePreviousMonthData";

const IncomeExpenseWidget = ({
  darkMode = false,
  currentMonth,
  transactionForCurrentMonth,
}) => {
  const { setCurrentMonth } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch previous month data using the custom hook
  const { data: prevMonthTransactions, isLoading: isPrevMonthLoading } =
    usePreviousMonthData(currentMonth);

  const changeMonth = (increment: number) => {
    setIsLoading(true);
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      return newMonth;
    });
  };

  useEffect(() => {
    // Simulating loading state for month change
    if (isLoading) {
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [currentMonth, isLoading]);

  const totalIncome =
    transactionForCurrentMonth
      ?.filter((item) => item.transactionType === "INCOME")
      .reduce((acc, item) => acc + Number(item.amount), 0) || 0;
  const totalExpenses =
    transactionForCurrentMonth
      ?.filter((item) => item.transactionType === "EXPENSE")
      .reduce((acc, item) => acc + Number(item.amount), 0) || 0;

  const balance = totalIncome - totalExpenses;

  // Calculate income percentage for progress bar
  const totalTransactions = totalIncome + totalExpenses;
  const incomePercentage =
    totalTransactions > 0
      ? Math.round((totalIncome / totalTransactions) * 100)
      : 50;

  // Calculate previous month totals
  const prevMonthIncome =
    prevMonthTransactions
      ?.filter((item) => item.transactionType === "INCOME")
      .reduce((acc, item) => acc + Number(item.amount), 0) || 0;
  console.log(
    "[index.tsx--[58]], prevMonthTransactions",
    prevMonthTransactions
  );
  const prevMonthExpenses =
    prevMonthTransactions
      ?.filter((item) => item.transactionType === "EXPENSE")
      .reduce((acc, item) => acc + Number(item.amount), 0) || 0;

  // Calculate month-over-month changes
  const incomeChange =
    prevMonthIncome > 0
      ? ((totalIncome - prevMonthIncome) / prevMonthIncome) * 100
      : 0;
  const expensesChange =
    prevMonthExpenses > 0
      ? ((totalExpenses - prevMonthExpenses) / prevMonthExpenses) * 100
      : 0;

  console.log("[index.tsx--[75]], incomeChange", prevMonthIncome, incomeChange);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 ${
        isLoading ? "opacity-70" : "opacity-100"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => changeMonth(-1)}
          className={`${
            darkMode
              ? "text-orange-400 hover:bg-gray-700"
              : "text-orange-600 hover:bg-orange-100"
          } p-2 rounded-full transition-colors`}
          disabled={isLoading}
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
          disabled={isLoading}
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

          {/* Progress bar for income vs expenses */}
          <div className="w-full h-3 bg-gray-100 rounded-full mb-6 overflow-hidden flex">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${incomePercentage}%` }}
            ></div>
            <div
              className="h-full bg-red-500 transition-all duration-500"
              style={{ width: `${100 - incomePercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mb-4 px-1">
            <span className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Income: {incomePercentage}%
            </span>
            <span className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Expenses: {100 - incomePercentage}%
            </span>
          </div>

          <div className="flex justify-between mb-6">
            <div>
              <div className="flex items-center">
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  } mr-2`}
                >
                  Income
                </p>
                {prevMonthIncome > 0 &&
                  incomeChange !== 0 &&
                  !isPrevMonthLoading && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        incomeChange >= 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {incomeChange >= 0 ? "+" : ""}
                      {incomeChange.toFixed(1)}%
                    </span>
                  )}
                {isPrevMonthLoading && (
                  <span className="ml-2 w-12 h-5 bg-gray-200 animate-pulse rounded-full"></span>
                )}
              </div>
              <p className="text-lg font-semibold text-green-500">
                ${totalIncome?.toFixed(2)}
              </p>
            </div>
            <div>
              <div className="flex items-center">
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  } mr-2`}
                >
                  Expenses
                </p>
                {prevMonthExpenses > 0 &&
                  expensesChange !== 0 &&
                  !isPrevMonthLoading && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        expensesChange <= 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {expensesChange >= 0 ? "+" : ""}
                      {expensesChange.toFixed(1)}%
                    </span>
                  )}
                {isPrevMonthLoading && (
                  <span className="ml-2 w-12 h-5 bg-gray-200 animate-pulse rounded-full"></span>
                )}
              </div>
              <p className="text-lg font-semibold text-red-500">
                ${totalExpenses?.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Quick actions */}
          <div
            className={`flex justify-between mt-4 pt-4 border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <button
              className={`flex items-center text-sm font-medium ${
                darkMode ? "text-orange-400" : "text-orange-600"
              } transition-colors hover:opacity-80`}
            >
              <PlusCircle className="w-4 h-4 mr-1" /> Add Transaction
            </button>
            <button
              className={`flex items-center text-sm font-medium ${
                darkMode ? "text-orange-400" : "text-orange-600"
              } transition-colors hover:opacity-80`}
            >
              <BarChart className="w-4 h-4 mr-1" /> View Report
            </button>
          </div>
        </div>
      }
    </div>
  );
};

export default IncomeExpenseWidget;
