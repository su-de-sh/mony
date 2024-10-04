"use client";
import { useEffect, useState } from "react";
import IncomeExpenseWidget from "@/sections/dashboard/IncomeExpensesWidget";
import { useQuery } from "@tanstack/react-query";
import RecentTransactionWidget from "@/sections/dashboard/RecentTransactionWIdget";
import { useRouter, useSearchParams } from "next/navigation";

const Dashboard = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Function to get 'currentMonth' from URL params or fallback to new Date()
  const getCurrentMonthFromParams = () => {
    const monthFromUrl = searchParams.get("currentMonth");
    return monthFromUrl ? new Date(monthFromUrl) : new Date();
  };

  // Initializing state with URL params or new Date
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonthFromParams);

  const { data: transactionForCurrentMonth } = useQuery({
    queryKey: ["transactionForCurrentMonth", currentMonth],
    queryFn: () =>
      fetch(`/api/transactions?currentMonth=${currentMonth.toISOString()}`, {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json()),
  });

  // Function to change month
  const changeMonth = (increment: number) => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      return newMonth;
    });
  };

  // Sync 'currentMonth' with URL params on mount and month change
  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("currentMonth", currentMonth.toISOString());
    const newUrl = `?${currentParams}`;
    router.replace(newUrl);
  }, [currentMonth, searchParams]); // Run when 'currentMonth' or 'searchParams' change

  return (
    <>
      <IncomeExpenseWidget
        darkMode={false}
        currentMonth={currentMonth}
        changeMonth={changeMonth}
        transactionForCurrentMonth={transactionForCurrentMonth}
      />

      <RecentTransactionWidget
        darkMode={false}
        transactionForCurrentMonth={transactionForCurrentMonth}
      />
    </>
  );
};

export default Dashboard;
