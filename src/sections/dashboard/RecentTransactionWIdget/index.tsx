"use client";
import { CATEGORIES } from "@/constants/categories";
import { motion } from "framer-motion";
import { format, isSameDay } from "date-fns";
import {
  ShoppingBag,
  Search,
  Calendar,
  ArrowDownUp,
  PlusCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useAppContext } from "@/contexts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const RecentTransactionWidget = ({ darkMode, transactionForCurrentMonth }) => {
  const { setIsAddingTransaction } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedDate, setSelectedDate] = useState(null);

  if (!transactionForCurrentMonth) {
    return (
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-xl shadow-lg p-4 mb-0 min-h-[200px]`}
      >
        <div className="flex flex-col items-center justify-center h-full py-12">
          <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-500">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (transactionForCurrentMonth.length === 0) {
    return (
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-xl shadow-lg p-4 mb-0`}
      >
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingBag
            className={`h-12 w-12 ${
              darkMode ? "text-gray-600" : "text-gray-300"
            } mb-4`}
          />
          <h3
            className={`text-lg font-medium ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            No transactions yet
          </h3>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
            Add your first transaction to start tracking your finances
          </p>
          <Button
            className="mt-4 bg-orange-500 hover:bg-orange-600"
            onClick={() => setIsAddingTransaction(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>
    );
  }

  // Filter transactions
  let filteredTransactions = [...transactionForCurrentMonth];

  // Filter by transaction type
  if (activeFilter === "income") {
    filteredTransactions = filteredTransactions.filter(
      (t) => t.transactionType === "INCOME"
    );
  } else if (activeFilter === "expense") {
    filteredTransactions = filteredTransactions.filter(
      (t) => t.transactionType === "EXPENSE"
    );
  }

  // Filter by date if selected
  if (selectedDate) {
    filteredTransactions = filteredTransactions.filter((t) =>
      isSameDay(new Date(t.date), selectedDate)
    );
  }

  // Search functionality
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredTransactions = filteredTransactions.filter((t) =>
      t.category.name.toLowerCase().includes(query)
    );
  }

  // Sort transactions
  switch (sortBy) {
    case "date-desc":
      filteredTransactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      break;
    case "date-asc":
      filteredTransactions.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      break;
    case "amount-desc":
      filteredTransactions.sort((a, b) => Number(b.amount) - Number(a.amount));
      break;
    case "amount-asc":
      filteredTransactions.sort((a, b) => Number(a.amount) - Number(b.amount));
      break;
  }

  // Group transactions by date
  const groupedByDate = filteredTransactions.reduce((groups, transaction) => {
    const date = format(new Date(transaction.date), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  // Format date heading
  const formatDateHeading = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (isSameDay(date, today)) {
      return "Today";
    } else if (isSameDay(date, yesterday)) {
      return "Yesterday";
    } else {
      return format(date, "EEEE, MMMM d, yyyy");
    }
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-xl shadow-lg p-4 mb-0 md:h-full md:mb-0 md:flex md:flex-col`}
    >
      <h2
        className={`text-lg font-semibold ${
          darkMode ? "text-orange-400" : "text-orange-600"
        } mb-4 flex items-center`}
      >
        <ShoppingBag className="h-5 w-5 mr-2" />
        Transactions
        <Button
          size="sm"
          variant="ghost"
          className="ml-auto text-orange-500 hover:text-orange-600 hover:bg-orange-50"
          onClick={() => setIsAddingTransaction(true)}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">Add</span>
        </Button>
      </h2>

      {/* Search and filters */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search transactions..."
            className={`pl-9 ${
              darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter buttons - Update with responsive design */}
        <div className="flex justify-between items-center md:flex-wrap md:gap-2">
          <div className="w-full overflow-x-auto pb-1">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className={`${
                  activeFilter === "all"
                    ? darkMode
                      ? "bg-gray-700"
                      : "bg-blue-50"
                    : ""
                } whitespace-nowrap`}
                onClick={() => setActiveFilter("all")}
              >
                All
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`${
                  activeFilter === "income"
                    ? darkMode
                      ? "bg-gray-700 text-green-400 border-green-600"
                      : "bg-green-50 text-green-600 border-green-200"
                    : ""
                } whitespace-nowrap`}
                onClick={() => setActiveFilter("income")}
              >
                Income
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`${
                  activeFilter === "expense"
                    ? darkMode
                      ? "bg-gray-700 text-red-400 border-red-600"
                      : "bg-red-50 text-red-600 border-red-200"
                    : ""
                } whitespace-nowrap`}
                onClick={() => setActiveFilter("expense")}
              >
                Expense
              </Button>
            </div>
          </div>
        </div>

        {/* Sort and date filter row - Add responsive design */}
        <div className="flex space-x-2 md:flex-wrap md:space-y-2 md:space-x-0 md:gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex items-center",
                  selectedDate &&
                    (darkMode
                      ? "bg-gray-700 border-blue-600"
                      : "bg-blue-50 border-blue-200")
                )}
                size="sm"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {selectedDate
                  ? format(selectedDate, "MMM d, yyyy")
                  : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {selectedDate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(null)}
              className="h-9"
            >
              <X className="h-4 w-4 mr-1" />
              Clear date
            </Button>
          )}

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center">
                <ArrowDownUp className="h-4 w-4 mr-2" />
                <span>Sort</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest first</SelectItem>
              <SelectItem value="date-asc">Oldest first</SelectItem>
              <SelectItem value="amount-desc">Highest amount</SelectItem>
              <SelectItem value="amount-asc">Lowest amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Show currently active date filter if one is selected */}
      {selectedDate && (
        <div
          className={`mb-4 px-3 py-2 rounded-md ${
            darkMode
              ? "bg-blue-900/20 text-blue-300"
              : "bg-blue-50 text-blue-800"
          } flex items-center justify-between`}
        >
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              Showing transactions for {format(selectedDate, "MMMM d, yyyy")}
            </span>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="md:flex-grow md:overflow-auto md:max-h-[600px] pr-1">
        <div className="space-y-4">
          {Object.entries(
            groupedByDate as Record<
              string,
              Array<{
                id: string;
                amount: number;
                date: string;
                transactionType: string;
                category: { name: string };
                remarks?: string;
              }>
            >
          ).map(([date, transactions]) => (
            <div key={date} className="space-y-2">
              <h3
                className={`text-sm font-medium sticky top-0 z-10 ${
                  darkMode
                    ? "text-gray-300 bg-gray-800/95"
                    : "text-gray-500 bg-white/95"
                } backdrop-blur-sm py-1`}
              >
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  {formatDateHeading(date)}
                </div>
              </h3>

              {transactions.map((transaction) => {
                const categoryInfo = CATEGORIES.find(
                  (cat) => cat.name === transaction.category.name
                );
                const Icon = categoryInfo ? categoryInfo.icon : ShoppingBag;
                const isIncome = transaction.transactionType === "INCOME";

                return (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex justify-between items-center p-3 ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-650"
                        : "bg-gray-50 hover:bg-gray-100"
                    } rounded-lg border ${
                      darkMode
                        ? "border-gray-600"
                        : isIncome
                        ? "border-green-100"
                        : "border-red-100"
                    } transition-colors`}
                  >
                    <div className="flex items-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-3 shrink-0"
                        style={{
                          backgroundColor: categoryInfo
                            ? categoryInfo.color
                            : "#ccc",
                        }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {transaction.category.name}
                        </p>
                        {transaction.remarks && (
                          <p
                            className={`text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            } truncate max-w-[120px]`}
                          >
                            {transaction.remarks}
                          </p>
                        )}
                      </div>
                    </div>
                    <p
                      className={`font-bold ${
                        isIncome ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {isIncome ? "+" : "-"}Rs.
                      {Number(transaction.amount).toFixed(2)}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-6">
            <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              No matching transactions found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactionWidget;
