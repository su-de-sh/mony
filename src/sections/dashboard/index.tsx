"use client";
import IncomeExpenseWidget from "@/sections/dashboard/IncomeExpensesWidget";
import RecentTransactionWidget from "@/sections/dashboard/RecentTransactionWIdget";
import { useAppContext } from "@/contexts";
import { useTransaction } from "@/hooks/useTransaction";

const MobileDashboard = () => {
  const { currentMonth } = useAppContext();

  const { data: transactionForCurrentMonth } = useTransaction(currentMonth);

  return (
    <div className="md:hidden">
      <IncomeExpenseWidget
        darkMode={false}
        currentMonth={currentMonth}
        transactionForCurrentMonth={transactionForCurrentMonth}
      />

      <RecentTransactionWidget
        darkMode={false}
        transactionForCurrentMonth={transactionForCurrentMonth}
      />
    </div>
  );
};

export default MobileDashboard;
