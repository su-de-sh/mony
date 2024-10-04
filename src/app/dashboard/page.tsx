"use client";
import { useEffect, useState } from "react";
import { Menu, Search, Moon, Sun } from "lucide-react";
import IncomeExpenseWidget from "@/sections/dashboard/IncomeExpensesWidget";
import { useQuery } from "@tanstack/react-query";
import RecentTransactionWidget from "@/sections/dashboard/RecentTransactionWIdget";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();

  const [darkMode, setDarkMode] = useState(false);

  const { data: transactionForCurrentMonth } = useQuery({
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
    const currentParams = new URLSearchParams(searchParams);

    currentParams.set("currentMonth", currentMonth.toISOString());

    const newUrl = `?${currentParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
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

        <RecentTransactionWidget
          darkMode={darkMode}
          transactionForCurrentMonth={transactionForCurrentMonth}
        />
      </div>
    </>
  );
}
