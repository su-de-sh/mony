"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  ShoppingBag,
  Briefcase,
  PiggyBank,
  Utensils,
  Home,
  Car,
  Film,
  Heart,
  Dumbbell,
  Plane,
  Gift,
  Smartphone,
  Coffee,
  Book,
  Moon,
  Sun,
  BarChart2,
  LogOut,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { signOut } from "next-auth/react";

type Transaction = {
  id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: Date;
};

const categories = [
  { name: "Shopping", icon: ShoppingBag, color: "#FF9F43" },
  { name: "Salary", icon: Briefcase, color: "#54A0FF" },
  { name: "Investments", icon: PiggyBank, color: "#5CAB7D" },
  { name: "Food", icon: Utensils, color: "#FF6B6B" },
  { name: "Housing", icon: Home, color: "#48DBB4" },
  { name: "Transport", icon: Car, color: "#5ED4F3" },
  { name: "Entertainment", icon: Film, color: "#FF9FF3" },
  { name: "Health", icon: Heart, color: "#FD7272" },
  { name: "Fitness", icon: Dumbbell, color: "#6C5CE7" },
  { name: "Travel", icon: Plane, color: "#1DD1A1" },
  { name: "Gifts", icon: Gift, color: "#FF6B6B" },
  { name: "Technology", icon: Smartphone, color: "#54A0FF" },
  { name: "Cafe", icon: Coffee, color: "#D6A2E8" },
  { name: "Education", icon: Book, color: "#FF9FF3" },
];

const MonyLogo = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="20" fill="#FF9F43" />
    <path
      d="M11 20C11 15.0294 15.0294 11 20 11C24.9706 11 29 15.0294 29 20C29 24.9706 24.9706 29 20 29"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="20" cy="20" r="4" fill="white" />
  </svg>
);

export default function Mony() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense"
  );
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const amountInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTransactions([]);
  }, []);

  useEffect(() => {
    if (isAddingTransaction && amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, [isAddingTransaction]);

  const addTransaction = () => {
    if (amount && category) {
      const newTransaction: Transaction = {
        id: Date.now(),
        type: transactionType,
        amount: parseFloat(amount),
        category,
        date: new Date(),
      };
      setTransactions((prevTransactions) => [
        newTransaction,
        ...prevTransactions,
      ]);
      setIsAddingTransaction(false);
      setAmount("");
      setCategory("");
    }
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.date.getMonth() === currentMonth.getMonth() &&
      t.date.getFullYear() === currentMonth.getFullYear()
  );

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const getCategoryTotal = (categoryName: string) => {
    return filteredTransactions
      .filter((t) => t.category === categoryName && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const changeMonth = (increment: number) => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      return newMonth;
    });
  };

  const chartData = categories
    .map((category) => ({
      name: category.name,
      value: getCategoryTotal(category.name),
      color: category.color,
    }))
    .filter((item) => item.value > 0);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-orange-50 to-orange-100 text-gray-800"
      } transition-colors duration-300`}
    >
      <div className="p-6 pb-24">
        <header className="flex justify-between items-center mb-8">
          <Menu
            className={`w-6 h-6 ${
              darkMode ? "text-orange-400" : "text-orange-600"
            }`}
          />
          <div className="flex items-center">
            <MonyLogo />
            <h1
              className={`text-3xl font-bold ${
                darkMode ? "text-orange-400" : "text-orange-600"
              } ml-2`}
            >
              Mony
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-6 h-6 text-yellow-400" />
              ) : (
                <Moon className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <Search
              className={`w-6 h-6 ${
                darkMode ? "text-orange-400" : "text-orange-600"
              }`}
            />
          </div>
        </header>

        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-3xl shadow-lg p-6 mb-8`}
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
              className={`text-2xl font-semibold ${
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
          <p
            className={`text-5xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            } mb-4`}
          >
            ${balance.toFixed(2)}
          </p>
          <div className="flex justify-between">
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Income
              </p>
              <p className="text-lg font-semibold text-green-500">
                ${totalIncome.toFixed(2)}
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
                ${totalExpenses.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {showAnalytics && (
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-3xl shadow-lg p-6 mb-8`}
          >
            <h2
              className={`text-2xl font-semibold ${
                darkMode ? "text-orange-400" : "text-orange-600"
              } mb-4`}
            >
              Expense Breakdown
            </h2>
            <div
              className="flex items-center justify-center"
              style={{ height: "300px" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {categories.map((category) => {
                const total = getCategoryTotal(category.name);
                if (total === 0) return null;
                const Icon = category.icon;
                return (
                  <div
                    key={category.name}
                    className={`flex items-center justify-between ${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    } p-3 rounded-xl`}
                  >
                    <div className="flex items-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: category.color }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-3xl shadow-lg p-6 mb-8`}
        >
          <h2
            className={`text-2xl font-semibold ${
              darkMode ? "text-orange-400" : "text-orange-600"
            } mb-4`}
          >
            Recent Transactions
          </h2>
          <div className="space-y-4">
            {filteredTransactions.slice(0, 5).map((transaction) => {
              const categoryInfo = categories.find(
                (cat) => cat.name === transaction.category
              );
              const Icon = categoryInfo ? categoryInfo.icon : ShoppingBag;
              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex justify-between items-center p-4 ${
                    darkMode ? "bg-gray-700" : "bg-gray-50"
                  } rounded-xl`}
                >
                  <div className="flex items-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                      style={{
                        backgroundColor: categoryInfo
                          ? categoryInfo.color
                          : "#ccc",
                      }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">
                        {transaction.category}
                      </p>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {transaction.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-bold text-lg ${
                      transaction.type === "income"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <nav
        className={`fixed bottom-0 left-0 right-0 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-lg rounded-t-3xl`}
      >
        <div className="flex justify-around items-center p-4">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`p-2 rounded-full ${
              darkMode
                ? "text-orange-400 hover:bg-gray-700"
                : "text-orange-600 hover:bg-orange-100"
            } transition-colors`}
          >
            <BarChart2 className="w-6 h-6" />
          </button>
          <motion.button
            className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg -mt-8"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsAddingTransaction(true)}
          >
            <Plus className="w-8 h-8 text-white" />
          </motion.button>
          <button
            className={`p-2 rounded-full ${
              darkMode
                ? "text-orange-400 hover:bg-gray-700"
                : "text-orange-600 hover:bg-orange-100"
            } transition-colors`}
            onClick={() => signOut()}
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isAddingTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } p-6 rounded-3xl w-full max-w-md`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className={`text-2xl font-bold ${
                    darkMode ? "text-orange-400" : "text-orange-600"
                  }`}
                >
                  Add Transaction
                </h3>
                <button
                  onClick={() => setIsAddingTransaction(false)}
                  className={`${
                    darkMode
                      ? "text-gray-400 hover:text-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex justify-around mb-4">
                <button
                  className={`px-6 py-2 rounded-full transition-colors ${
                    transactionType === "expense"
                      ? "bg-red-500 text-white"
                      : darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => setTransactionType("expense")}
                >
                  Expense
                </button>
                <button
                  className={`px-6 py-2 rounded-full transition-colors ${
                    transactionType === "income"
                      ? "bg-green-500 text-white"
                      : darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => setTransactionType("income")}
                >
                  Income
                </button>
              </div>
              <input
                ref={amountInputRef}
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className={`w-full p-3 mb-4 rounded-xl ${
                  darkMode
                    ? "bg-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-100 text-gray-800 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full p-3 mb-4 rounded-xl ${
                  darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-800"
                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                onClick={addTransaction}
                className={`w-full p-3 rounded-xl text-white font-semibold ${
                  darkMode
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-orange-500 hover:bg-orange-600"
                } transition-colors`}
              >
                Add Transaction
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
