"use client";
import { useState } from "react";
import { CATEGORIES } from "@/constants/categories";
import { format, subMonths } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  ArrowUp,
  ArrowDown,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react";
import usePreviousMonthData from "@/hooks/usePreviousMonthData";

const COLORS = [
  "#FF9F43",
  "#54A0FF",
  "#FF6B6B",
  "#1DD1A1",
  "#5ED4F3",
  "#FF9FF3",
  "#FD7272",
  "#6C5CE7",
];

const MonthlyOverview = ({
  darkMode = false,
  currentMonth,
  transactionForCurrentMonth,
}) => {
  const [chartType, setChartType] = useState("pie"); // "pie" or "bar"
  const { data: prevMonthTransactions } = usePreviousMonthData(currentMonth);

  if (!transactionForCurrentMonth) {
    return (
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-xl shadow-lg p-6 mb-0 flex items-center justify-center h-64`}
      >
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
        <p className="ml-3 text-gray-500">Loading data...</p>
      </div>
    );
  }

  // Calculate top spending categories
  const getCategoryTotal = (data, categoryName) => {
    return (
      data
        ?.filter(
          (t) =>
            t.category.name === categoryName && t.transactionType === "EXPENSE"
        )
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0
    );
  };

  // Create data for pie chart
  const pieChartData = CATEGORIES.filter(
    (category) => category.type === "EXPENSE"
  )
    .map((category) => {
      const value = getCategoryTotal(transactionForCurrentMonth, category.name);
      return {
        name: category.name,
        value,
        color:
          category.color || COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 categories

  // Calculate total expenses
  const totalExpenses =
    transactionForCurrentMonth
      ?.filter((item) => item.transactionType === "EXPENSE")
      .reduce((acc, item) => acc + Number(item.amount), 0) || 0;

  // Calculate total income
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

  // Create data for bar chart (month comparison)
  const barChartData = [
    {
      name: format(subMonths(currentMonth, 1), "MMM"),
      income: prevMonthIncome,
      expenses: prevMonthExpenses,
    },
    {
      name: format(currentMonth, "MMM"),
      income: totalIncome,
      expenses: totalExpenses,
    },
  ];

  // Calculate month-over-month changes
  const expenseChange =
    prevMonthExpenses > 0
      ? ((totalExpenses - prevMonthExpenses) / prevMonthExpenses) * 100
      : 0;

  const incomeChange =
    prevMonthIncome > 0
      ? ((totalIncome - prevMonthIncome) / prevMonthIncome) * 100
      : 0;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-xl shadow-lg p-6 mb-0 md:mb-0 h-full flex flex-col overflow-auto`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className={`text-xl font-semibold ${
            darkMode ? "text-orange-400" : "text-orange-600"
          }`}
        >
          Monthly Overview
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType("pie")}
            className={`p-2 rounded ${
              chartType === "pie"
                ? "bg-orange-100 text-orange-600"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <PieChartIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`p-2 rounded ${
              chartType === "bar"
                ? "bg-orange-100 text-orange-600"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <BarChartIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div
          className={`p-4 rounded-lg ${
            darkMode ? "bg-gray-700" : "bg-orange-50"
          }`}
        >
          <h3 className="text-sm text-gray-500 mb-1">Total Expenses</h3>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-800">
              {formatCurrency(totalExpenses)}
            </span>
            {prevMonthExpenses > 0 && (
              <div
                className={`ml-2 flex items-center text-xs ${
                  expenseChange > 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                {expenseChange > 0 ? (
                  <ArrowUp className="w-3 h-3 mr-1" />
                ) : (
                  <ArrowDown className="w-3 h-3 mr-1" />
                )}
                {Math.abs(expenseChange).toFixed(1)}%
              </div>
            )}
          </div>
        </div>

        <div
          className={`p-4 rounded-lg ${
            darkMode ? "bg-gray-700" : "bg-blue-50"
          }`}
        >
          <h3 className="text-sm text-gray-500 mb-1">Total Income</h3>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-800">
              {formatCurrency(totalIncome)}
            </span>
            {prevMonthIncome > 0 && (
              <div
                className={`ml-2 flex items-center text-xs ${
                  incomeChange > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {incomeChange > 0 ? (
                  <ArrowUp className="w-3 h-3 mr-1" />
                ) : (
                  <ArrowDown className="w-3 h-3 mr-1" />
                )}
                {Math.abs(incomeChange).toFixed(1)}%
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-hidden relative min-h-[400px]">
        {chartType === "pie" ? (
          pieChartData.length > 0 ? (
            <div className="h-[400px] w-full max-w-full overflow-x-hidden">
              <ResponsiveContainer width="95%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      padding: "0.75rem",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    labelStyle={{
                      color: "#374151",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                    }}
                    itemStyle={{
                      color: "#6B7280",
                      fontSize: "0.875rem",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{
                      paddingTop: "1rem",
                      fontSize: "0.875rem",
                      width: "90%",
                      margin: "0 auto",
                    }}
                    formatter={(value) => (
                      <span className="text-sm text-gray-600">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-gray-500">
              No expense data available
            </div>
          )
        ) : (
          <div className="h-[400px] w-full max-w-full overflow-x-hidden">
            <ResponsiveContainer width="95%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  labelStyle={{
                    color: "#374151",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                  itemStyle={{
                    color: "#6B7280",
                    fontSize: "0.875rem",
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-sm text-gray-600">{value}</span>
                  )}
                  wrapperStyle={{
                    width: "90%",
                    margin: "0 auto",
                  }}
                />
                <Bar
                  dataKey="income"
                  fill="#54A0FF"
                  name="Income"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  fill="#FF6B6B"
                  name="Expenses"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4 mt-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
          Top Spending Categories
        </h3>

        <div className="space-y-3">
          {pieChartData.length > 0 ? (
            pieChartData.map((category, idx) => {
              // Calculate percentage of total expenses
              const percentage =
                totalExpenses > 0
                  ? ((category.value / totalExpenses) * 100).toFixed(1)
                  : 0;

              return (
                <div key={idx} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm text-gray-700 flex-grow">
                    {category.name}
                  </span>
                  <span className="text-sm font-medium">
                    {formatCurrency(category.value)}
                  </span>
                  <span className="text-xs text-gray-500 ml-2 w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center">
              No expense data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyOverview;
