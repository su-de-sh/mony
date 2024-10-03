"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Plus,
  X,
  Moon,
  Sun,
  BarChart2,
  LogOut,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { signOut } from "next-auth/react";
import TransactionForm from "@/components/organism/transaction/TransactionForm";
import IncomeExpenseWidget from "@/sections/dashboard/IncomeExpensesWidget";
import { useQuery } from "@tanstack/react-query";
import RecentTransactionWidget from "@/sections/dashboard/RecentTransactionWIdget";
import { CATEGORIES } from "@/constants/categories";

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
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [isAddingTransaction, setIsAddingTransaction] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const amountInputRef = useRef<HTMLInputElement>(null);

  const { data: transactionForCurrentMonth, refetch } = useQuery({
    queryKey: ["transactionForCurrentMonth", currentMonth],
    queryFn: () =>
      fetch(`/api/transactions?currentMonth=${currentMonth}`, {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json()),
  });

  const changeMonth = (increment: number) => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      return newMonth;
    });
  };

  useEffect(() => {
    if (isAddingTransaction && amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, [isAddingTransaction]);

  const getCategoryTotal = (categoryName: string) => {
    return transactionForCurrentMonth
      ?.filter(
        (t) =>
          t.category.name === categoryName && t.transactionType === "EXPENSE"
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  const chartData = CATEGORIES.map((category) => ({
    name: category.name,
    value: getCategoryTotal(category.name),
    color: category.color,
  })).filter((item) => item.value > 0);

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
        <section>
          <IncomeExpenseWidget
            darkMode={darkMode}
            currentMonth={currentMonth}
            changeMonth={changeMonth}
            transactionForCurrentMonth={transactionForCurrentMonth}
          />
        </section>

        {showAnalytics && (
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
              {chartData.length > 0 && (
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
              )}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {CATEGORIES.map((category) => {
                const total = getCategoryTotal(category.name);
                if (total === 0) return null;
                const Icon = category.icon;
                return (
                  <div
                    key={category.name}
                    className={`  flex items-center justify-between ${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    } p-2 rounded-xl`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center "
                        style={{ backgroundColor: category.color }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex flex-col max-w-20 ">
                        <span className="font-medium truncate">
                          {category.name}
                        </span>
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
        )}

        <RecentTransactionWidget
          darkMode={darkMode}
          transactionForCurrentMonth={transactionForCurrentMonth}
        />
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
              } p-6 rounded-xl w-full max-w-md`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className={`text-xl font-bold ${
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

              <TransactionForm
                darkMode={darkMode}
                categories={CATEGORIES}
                setIsAddingTransaction={setIsAddingTransaction}
                refetch={refetch}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
