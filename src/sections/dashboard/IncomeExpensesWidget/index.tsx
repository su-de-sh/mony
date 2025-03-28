"use client";
import { useAppContext } from "@/contexts";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
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

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 ${
        isLoading ? "opacity-70" : "opacity-100"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Financial Overview
            </h2>
            <p className="text-sm text-gray-500">
              Track your monthly performance
            </p>
          </div>
        </div>
        <div className="flex items-center bg-white rounded-lg shadow-sm p-1">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            disabled={isLoading}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-sm font-medium text-gray-700 mx-2">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            disabled={isLoading}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="md:flex md:flex-col md:items-center">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-1">Current Balance</p>
          <p className="font-bold text-4xl md:text-5xl text-gray-900">
            ${balance?.toFixed(2)}
          </p>
        </div>

        {/* Progress bar for income vs expenses */}
        <div className="w-full md:max-w-xl h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${incomePercentage}%` }}
          ></div>
          <div
            className="h-full bg-red-500 transition-all duration-500"
            style={{ width: `${100 - incomePercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm mb-6 px-1 w-full md:max-w-xl">
          <span className="text-gray-600">Income: {incomePercentage}%</span>
          <span className="text-gray-600">
            Expenses: {100 - incomePercentage}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:max-w-xl">
          <div className="bg-green-50 rounded-xl p-4">
            <div className="mb-1">
              <p className="text-sm text-gray-600">Income</p>
            </div>
            <p className="text-xl font-semibold text-green-600 mb-1">
              ${totalIncome?.toFixed(2)}
            </p>
            {prevMonthIncome > 0 &&
            incomeChange !== 0 &&
            !isPrevMonthLoading ? (
              <div className="mt-1">
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full inline-block ${
                    incomeChange >= 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {incomeChange >= 0 ? "+" : ""}
                  {incomeChange.toFixed(1)}
                </span>
                <span className="text-xs"> % from last month</span>
              </div>
            ) : isPrevMonthLoading ? (
              <div className="mt-1">
                <span className="w-24 h-4 bg-gray-200 animate-pulse rounded-full inline-block"></span>
              </div>
            ) : null}
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <div className="mb-1">
              <p className="text-sm text-gray-600">Expenses</p>
            </div>
            <p className="text-xl font-semibold text-red-600 mb-1">
              ${totalExpenses?.toFixed(2)}
            </p>
            {prevMonthExpenses > 0 &&
            expensesChange !== 0 &&
            !isPrevMonthLoading ? (
              <div className="mt-1">
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full inline-block ${
                    expensesChange <= 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {expensesChange >= 0 ? "+" : ""}
                  {expensesChange.toFixed(1)}
                </span>
                <span className="text-xs"> % from last month</span>
              </div>
            ) : isPrevMonthLoading ? (
              <div className="mt-1">
                <span className="w-24 h-4 bg-gray-200 animate-pulse rounded-full inline-block"></span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeExpenseWidget;
