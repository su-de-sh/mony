"use client";
import IncomeExpenseWidget from "@/sections/dashboard/IncomeExpensesWidget";
import RecentTransactionWidget from "@/sections/dashboard/RecentTransactionWIdget";
import { useAppContext } from "@/contexts";
import { useTransaction } from "@/hooks/useTransaction";

const Dashboard = () => {
  const { currentMonth } = useAppContext();

  const { data: transactionForCurrentMonth } = useTransaction(currentMonth);

  return (
    <>
      <IncomeExpenseWidget
        darkMode={false}
        currentMonth={currentMonth}
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
