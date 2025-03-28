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

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full ${
              activeFilter === "all"
                ? "bg-orange-100 text-orange-600"
                : "text-gray-500 bg-gray-50"
            } whitespace-nowrap`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full ${
              activeFilter === "income"
                ? "bg-green-100 text-green-600"
                : "text-gray-500 bg-gray-50"
            } whitespace-nowrap`}
            onClick={() => setActiveFilter("income")}
          >
            Income
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full ${
              activeFilter === "expense"
                ? "bg-red-100 text-red-600"
                : "text-gray-500 bg-gray-50"
            } whitespace-nowrap`}
            onClick={() => setActiveFilter("expense")}
          >
            Expenses
          </Button>

          <div className="ml-auto flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    selectedDate
                      ? "bg-orange-100 text-orange-600"
                      : "text-gray-500 bg-gray-50"
                  } rounded-full flex items-center`}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  {selectedDate ? (
                    <span className="text-xs">
                      {format(selectedDate, "MMM d")}
                    </span>
                  ) : (
                    <span className="text-xs">Date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-auto" align="end">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date)}
                  initialFocus
                />
                {selectedDate && (
                  <div className="flex justify-end p-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDate(null)}
                      className="text-xs text-gray-500"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 bg-gray-50 rounded-full flex items-center"
                >
                  <ArrowDownUp className="h-4 w-4 mr-1" />
                  <span className="text-xs">Sort</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2 w-48" align="end">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full text-xs">
                    <span>
                      {sortBy === "date-desc"
                        ? "Newest first"
                        : sortBy === "date-asc"
                        ? "Oldest first"
                        : sortBy === "amount-desc"
                        ? "Highest amount"
                        : "Lowest amount"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest first</SelectItem>
                    <SelectItem value="date-asc">Oldest first</SelectItem>
                    <SelectItem value="amount-desc">Highest amount</SelectItem>
                    <SelectItem value="amount-asc">Lowest amount</SelectItem>
                  </SelectContent>
                </Select>
              </PopoverContent>
            </Popover>
          </div>
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDate(null)}
            className="text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      )}

      {/* Transaction List */}
      <div className="flex-1 overflow-auto">
        {Object.keys(groupedByDate).length > 0 ? (
          <div className="space-y-6">
            {Object.keys(groupedByDate).map((date) => (
              <div key={date}>
                <h3
                  className={`text-sm font-medium text-gray-500 mb-2 sticky top-0 py-1 ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  {formatDateHeading(date)}
                </h3>
                <div className="space-y-2">
                  {groupedByDate[date].map((transaction) => {
                    // Find category details
                    const category = CATEGORIES.find(
                      (c) => c.name === transaction.category.name
                    );

                    return (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg ${
                          darkMode ? "bg-gray-700" : "bg-gray-50"
                        } flex items-center`}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                          style={{
                            backgroundColor:
                              `${category?.color}20` || "#e5e7eb",
                          }}
                        >
                          {category?.icon ? (
                            <category.icon
                              className="w-5 h-5"
                              style={{ color: category.color || "#9ca3af" }}
                            />
                          ) : (
                            <ShoppingBag
                              className="w-5 h-5"
                              style={{ color: "#9ca3af" }}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <p
                              className={`font-medium ${
                                darkMode ? "text-gray-200" : "text-gray-800"
                              } truncate`}
                            >
                              {transaction.category.name}
                            </p>
                            <p
                              className={`font-medium ${
                                transaction.transactionType === "INCOME"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.transactionType === "INCOME"
                                ? "+"
                                : "-"}
                              ${transaction.amount}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            {transaction.note ? (
                              <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                {transaction.note}
                              </p>
                            ) : (
                              <div></div>
                            )}
                            <p className="text-xs text-gray-500">
                              {format(new Date(transaction.date), "h:mm a")}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
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
              No results found
            </h3>
            <p
              className={`${
                darkMode ? "text-gray-400" : "text-gray-500"
              } mt-1 max-w-xs mx-auto`}
            >
              Try adjusting your filters or search terms to find what
              you&apos;re looking for
            </p>
            <Button
              className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
                setSelectedDate(null);
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactionWidget;
