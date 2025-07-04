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
    <div className="md:hidden space-y-3  max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back!</p>
        </div>
      </div>

      <div className="overflow-x-hidden">
        <IncomeExpenseWidget
          darkMode={false}
          currentMonth={currentMonth}
          transactionForCurrentMonth={transactionForCurrentMonth}
        />
      </div>

      <div className="overflow-x-hidden">
        <MonthlyOverview
          darkMode={false}
          currentMonth={currentMonth}
          transactionForCurrentMonth={transactionForCurrentMonth}
        />
      </div>

      <div className="overflow-x-hidden">
        <RecentTransactionWidget
          darkMode={false}
          transactionForCurrentMonth={transactionForCurrentMonth}
        />
      </div>
    </div>
  );
};

export const DesktopDashboard = () => {
  const { currentMonth } = useAppContext();
  const { data: transactionForCurrentMonth } = useTransaction(currentMonth);

  return (
    <div className="hidden md:block min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto p-4 space-y-4 overflow-x-hidden">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back!</p>
          </div>
          {/* Removed the redundant Add Transaction button since we now have the floating action button */}
        </div>

        <div className="grid grid-cols-12 gap-3 lg:gap-4 overflow-x-hidden">
          {/* Left column - Income/Expense and Monthly Overview */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-3 lg:gap-4 overflow-x-hidden">
            <div className="overflow-x-hidden">
              <IncomeExpenseWidget
                darkMode={false}
                currentMonth={currentMonth}
                transactionForCurrentMonth={transactionForCurrentMonth}
              />
            </div>

            <div className="overflow-x-hidden">
              <MonthlyOverview
                darkMode={false}
                currentMonth={currentMonth}
                transactionForCurrentMonth={transactionForCurrentMonth}
              />
            </div>
          </div>

          {/* Right column - Recent Transactions */}
          <div className="col-span-12 lg:col-span-4 overflow-x-hidden">
            <div className="overflow-x-hidden">
              <RecentTransactionWidget
                darkMode={false}
                transactionForCurrentMonth={transactionForCurrentMonth}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="overflow-x-hidden">
      <MobileDashboard />
      <DesktopDashboard />
    </div>
  );
};

export default Dashboard;
