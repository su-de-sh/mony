"use client";
import { useEffect, useState } from "react";
import IncomeExpenseWidget from "@/sections/dashboard/IncomeExpensesWidget";
import { useQuery } from "@tanstack/react-query";
import RecentTransactionWidget from "@/sections/dashboard/RecentTransactionWIdget";
import { useSearchParams } from "next/navigation";

const Dashboard = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const searchParams = useSearchParams();

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
