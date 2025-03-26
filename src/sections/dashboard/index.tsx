"use client";
import IncomeExpenseWidget from "@/sections/dashboard/IncomeExpensesWidget";
import RecentTransactionWidget from "@/sections/dashboard/RecentTransactionWIdget";
import { useAppContext } from "@/contexts";
import { useTransaction } from "@/hooks/useTransaction";
import MonthlyOverview from "@/sections/dashboard/MonthlyOverview";

export const MobileDashboard = () => {
  const { currentMonth } = useAppContext();

  const { data: transactionForCurrentMonth } = useTransaction(currentMonth);

  return (
    <div className="md:hidden space-y-8">
      <IncomeExpenseWidget
        darkMode={false}
        currentMonth={currentMonth}
        transactionForCurrentMonth={transactionForCurrentMonth}
      />

      <MonthlyOverview
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

export const DesktopDashboard = () => {
  const { currentMonth } = useAppContext();

  const { data: transactionForCurrentMonth } = useTransaction(currentMonth);

  return (
    <div className="hidden md:block">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <IncomeExpenseWidget
              darkMode={false}
              currentMonth={currentMonth}
              transactionForCurrentMonth={transactionForCurrentMonth}
            />

            <div className="mt-8">
              <MonthlyOverview
                darkMode={false}
                currentMonth={currentMonth}
                transactionForCurrentMonth={transactionForCurrentMonth}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <RecentTransactionWidget
              darkMode={false}
              transactionForCurrentMonth={transactionForCurrentMonth}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <>
      <MobileDashboard />
      <DesktopDashboard />
    </>
  );
};

export default Dashboard;
