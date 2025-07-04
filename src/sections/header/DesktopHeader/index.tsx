"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp, DollarSign } from "lucide-react";
import { useAppContext } from "@/contexts";

const DesktopHeader = () => {
  const { setIsAddingTransaction } = useAppContext();

  return (
    <div className="hidden md:block bg-white border-b border-gray-200 px-6 py-4 mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Track your financial progress</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Quick Stats */}
          <div className="hidden lg:flex items-center space-x-6 mr-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-lg font-semibold text-gray-900">Overview</p>
            </div>
          </div>

          {/* Add Transaction Button */}
          <Button
            onClick={() => setIsAddingTransaction(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center space-x-2"
            size="lg"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="font-medium">Add Transaction</span>
          </Button>

          {/* Quick Add Buttons */}
          <div className="hidden xl:flex items-center space-x-2">
            <Button
              onClick={() => setIsAddingTransaction(true)}
              variant="outline"
              size="sm"
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Income
            </Button>
            <Button
              onClick={() => setIsAddingTransaction(true)}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Expense
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;
