"use client";
import { CATEGORIES } from "@/constants/categories";
import PieChartWidget from "@/sections/analytics/PieChartWidget";
import { useAppContext } from "@/contexts";
import { useTransaction } from "@/hooks/useTransaction";
import { format, subMonths } from "date-fns";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import usePreviousMonthData from "@/hooks/usePreviousMonthData";

const Analytics = () => {
  const { currentMonth, setCurrentMonth } = useAppContext();
  const [activeTab, setActiveTab] = useState("expense"); // expense, income, trends

  const { data: transactionForCurrentMonth } = useTransaction(currentMonth);
  const { data: prevMonthTransactions } = usePreviousMonthData(currentMonth);

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

  const chartData = CATEGORIES.filter((category) => category.type === "EXPENSE")
    .map((category) => ({
      name: category.name,
      value: getCategoryTotal(category.name),
      color: category.color,
    }))
    .filter((item) => item.value > 0);

  // Calculate total expenses and income
  const totalExpenses =
    transactionForCurrentMonth
      ?.filter((item) => item.transactionType === "EXPENSE")
      .reduce((acc, item) => acc + Number(item.amount), 0) || 0;

  const totalIncome =
    transactionForCurrentMonth
      ?.filter((item) => item.transactionType === "INCOME")
      .reduce((acc, item) => acc + Number(item.amount), 0) || 0;

  // Calculate previous month totals
  const prevMonthExpenses =
    prevMonthTransactions
      ?.filter((item) => item.transactionType === "EXPENSE")
      .reduce((acc, item) => acc + Number(item.amount), 0) || 0;

  const prevMonthIncome =
    prevMonthTransactions
      ?.filter((item) => item.transactionType === "INCOME")
      .reduce((acc, item) => acc + Number(item.amount), 0) || 0;

  // Calculate month-over-month changes
  const expenseChange =
    prevMonthExpenses > 0
      ? ((totalExpenses - prevMonthExpenses) / prevMonthExpenses) * 100
      : 0;

  const incomeChange =
    prevMonthIncome > 0
      ? ((totalIncome - prevMonthIncome) / prevMonthIncome) * 100
      : 0;

  // Generate income category data
  const incomeChartData = CATEGORIES.filter(
    (category) => category.type === "INCOME"
  )
    .map((category) => {
      const value =
        transactionForCurrentMonth
          ?.filter(
            (t) =>
              t.category.name === category.name &&
              t.transactionType === "INCOME"
          )
          .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      return {
        name: category.name,
        value,
        color: category.color,
      };
    })
    .filter((item) => item.value > 0);

  // Generate mock trend data for monthly spending over 6 months
  const generateTrendData = () => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(currentMonth, i);
      data.push({
        name: format(monthDate, "MMM"),
        expenses: i === 0 ? totalExpenses : Math.random() * 5000 + 1000,
        income: i === 0 ? totalIncome : Math.random() * 7000 + 2000,
      });
    }
    return data;
  };

  const trendData = generateTrendData();

  const changeMonth = (increment: number) => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      return newMonth;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your financial performance
          </p>
        </div>

        <div className="flex items-center bg-white rounded-lg shadow-sm p-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mx-4">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              ${totalIncome.toFixed(2)}
            </span>
            {prevMonthIncome > 0 && (
              <div
                className={`ml-3 flex items-center text-sm ${
                  incomeChange > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {incomeChange > 0 ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                {Math.abs(incomeChange).toFixed(1)}%
              </div>
            )}
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{
                width: `${
                  (totalIncome / (totalIncome + totalExpenses)) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">
              Total Expenses
            </h3>
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              ${totalExpenses.toFixed(2)}
            </span>
            {prevMonthExpenses > 0 && (
              <div
                className={`ml-3 flex items-center text-sm ${
                  expenseChange > 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                {expenseChange > 0 ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                {Math.abs(expenseChange).toFixed(1)}%
              </div>
            )}
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-500"
              style={{
                width: `${
                  (totalExpenses / (totalIncome + totalExpenses)) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Net Savings</h3>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                totalIncome - totalExpenses >= 0 ? "bg-green-50" : "bg-red-50"
              }`}
            >
              {totalIncome - totalExpenses >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              ${(totalIncome - totalExpenses).toFixed(2)}
            </span>
            {prevMonthIncome > 0 && prevMonthExpenses > 0 && (
              <div
                className={`ml-3 flex items-center text-sm ${
                  totalIncome - totalExpenses >
                  prevMonthIncome - prevMonthExpenses
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {totalIncome - totalExpenses >
                prevMonthIncome - prevMonthExpenses ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                {Math.abs(
                  ((totalIncome -
                    totalExpenses -
                    (prevMonthIncome - prevMonthExpenses)) /
                    (prevMonthIncome - prevMonthExpenses)) *
                    100
                ).toFixed(1)}
                %
              </div>
            )}
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                totalIncome - totalExpenses >= 0 ? "bg-green-500" : "bg-red-500"
              }`}
              style={{
                width: `${Math.min(
                  Math.abs(
                    (totalIncome - totalExpenses) /
                      (totalIncome + totalExpenses)
                  ) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <Button
          variant={activeTab === "expense" ? "default" : "ghost"}
          className={`whitespace-nowrap rounded-none border-b-2 ${
            activeTab === "expense"
              ? "bg-transparent text-orange-600 border-orange-600 hover:bg-orange-50"
              : "text-gray-600 border-transparent hover:border-gray-300"
          }`}
          onClick={() => setActiveTab("expense")}
        >
          Expense Analysis
        </Button>
        <Button
          variant={activeTab === "income" ? "default" : "ghost"}
          className={`whitespace-nowrap rounded-none border-b-2 ${
            activeTab === "income"
              ? "bg-transparent text-orange-600 border-orange-600 hover:bg-orange-50"
              : "text-gray-600 border-transparent hover:border-gray-300"
          }`}
          onClick={() => setActiveTab("income")}
        >
          Income Analysis
        </Button>
        <Button
          variant={activeTab === "trends" ? "default" : "ghost"}
          className={`whitespace-nowrap rounded-none border-b-2 ${
            activeTab === "trends"
              ? "bg-transparent text-orange-600 border-orange-600 hover:bg-orange-50"
              : "text-gray-600 border-transparent hover:border-gray-300"
          }`}
          onClick={() => setActiveTab("trends")}
        >
          Monthly Trends
        </Button>
      </div>

      {/* Tab content */}
      {activeTab === "expense" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Expense Breakdown
            </h2>
            <div style={{ height: "300px", width: "100%" }}>
              {chartData.length > 0 ? (
                <PieChartWidget chartData={chartData} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No expense data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Top Expenses
            </h2>
            <div className="space-y-4">
              {chartData
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
                .map((category) => {
                  const Icon = CATEGORIES.find(
                    (c) => c.name === category.name
                  )?.icon;
                  const percentage = (category.value / totalExpenses) * 100;

                  return (
                    <div
                      key={category.name}
                      className="flex items-center space-x-3"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: category.color }}
                      >
                        {Icon && <Icon className="w-5 h-5 text-white" />}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-medium text-gray-900">
                            {category.name}
                          </p>
                          <p className="text-sm font-semibold text-gray-700">
                            ${category.value.toFixed(2)} (
                            {percentage.toFixed(1)}%)
                          </p>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-500"
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
          </div>
        </div>
      )}

      {activeTab === "income" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Income Breakdown
            </h2>
            <div style={{ height: "300px", width: "100%" }}>
              {incomeChartData.length > 0 ? (
                <PieChartWidget chartData={incomeChartData} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No income data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Income Sources
            </h2>
            <div className="space-y-4">
              {incomeChartData
                .sort((a, b) => b.value - a.value)
                .map((category) => {
                  const Icon = CATEGORIES.find(
                    (c) => c.name === category.name
                  )?.icon;
                  const percentage = (category.value / totalIncome) * 100;

                  return (
                    <div
                      key={category.name}
                      className="flex items-center space-x-3"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: category.color }}
                      >
                        {Icon && <Icon className="w-5 h-5 text-white" />}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-medium text-gray-900">
                            {category.name}
                          </p>
                          <p className="text-sm font-semibold text-gray-700">
                            ${category.value.toFixed(2)} (
                            {percentage.toFixed(1)}%)
                          </p>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-500"
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
          </div>
        </div>
      )}

      {activeTab === "trends" && (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Trends
            </h2>
            <div style={{ height: "300px", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#3B82F6"
                    name="Income"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#EF4444"
                    name="Expenses"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
