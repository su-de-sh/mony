"use client";

import { useFormState } from "react-dom";
import { editTransaction } from "@/app/actions/transaction";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarIcon,
  ShoppingBag,
  Home,
  Utensils,
  FilmIcon,
  Smartphone,
  Shirt,
  Stethoscope,
  GraduationCap,
  Gift,
  Bus,
  Plane,
  DollarSign,
  Briefcase,
  Building2,
  File,
  Laptop,
  Users,
  Shield,
  Dumbbell,
  ShoppingCart,
  Store,
  Search,
  X,
  Scissors,
  Sparkles,
  CalendarClock,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const initialState = {
  message: null,
  error: null,
};

// Same categories as in TransactionForm
const EXPENSE_CATEGORIES = [
  {
    group: "Essential Living",
    items: [
      { name: "Groceries", icon: <ShoppingCart className="h-4 w-4 mr-2" /> },
      { name: "Rent Expense", icon: <Home className="h-4 w-4 mr-2" /> },
      { name: "Utilities", icon: <Smartphone className="h-4 w-4 mr-2" /> },
      { name: "Home Improvement", icon: <Store className="h-4 w-4 mr-2" /> },
    ],
  },
  {
    group: "Food & Entertainment",
    items: [
      { name: "Food", icon: <Utensils className="h-4 w-4 mr-2" /> },
      { name: "Entertainment", icon: <FilmIcon className="h-4 w-4 mr-2" /> },
    ],
  },
  {
    group: "Health & Education",
    items: [
      { name: "Healthcare", icon: <Stethoscope className="h-4 w-4 mr-2" /> },
      { name: "Insurance", icon: <Shield className="h-4 w-4 mr-2" /> },
      { name: "Education", icon: <GraduationCap className="h-4 w-4 mr-2" /> },
      { name: "Fitness", icon: <Dumbbell className="h-4 w-4 mr-2" /> },
    ],
  },
  {
    group: "Transportation & Travel",
    items: [
      { name: "Transportation", icon: <Bus className="h-4 w-4 mr-2" /> },
      { name: "Travel", icon: <Plane className="h-4 w-4 mr-2" /> },
    ],
  },
  {
    group: "Personal & Shopping",
    items: [
      { name: "Clothing", icon: <Shirt className="h-4 w-4 mr-2" /> },
      { name: "Gadgets", icon: <Smartphone className="h-4 w-4 mr-2" /> },
      { name: "Pet", icon: <Gift className="h-4 w-4 mr-2" /> },
      { name: "Gifts", icon: <Gift className="h-4 w-4 mr-2" /> },
      { name: "Cosmetic", icon: <Sparkles className="h-4 w-4 mr-2" /> },
      { name: "Personal Care", icon: <Scissors className="h-4 w-4 mr-2" /> },
    ],
  },
  {
    group: "Services & Subscriptions",
    items: [
      {
        name: "Subscription",
        icon: <CalendarClock className="h-4 w-4 mr-2" />,
      },
    ],
  },
  {
    group: "Financial",
    items: [
      { name: "Loan Given", icon: <Users className="h-4 w-4 mr-2" /> },
      { name: "EMI", icon: <Briefcase className="h-4 w-4 mr-2" /> },
      {
        name: "Collateral Load",
        icon: <DollarSign className="h-4 w-4 mr-2" />,
      },
    ],
  },
  {
    group: "Other",
    items: [
      { name: "Other Expense", icon: <ShoppingBag className="h-4 w-4 mr-2" /> },
    ],
  },
];

const INCOME_CATEGORIES = [
  {
    group: "Employment",
    items: [
      { name: "Salary", icon: <Briefcase className="h-4 w-4 mr-2" /> },
      { name: "Freelancing", icon: <Laptop className="h-4 w-4 mr-2" /> },
    ],
  },
  {
    group: "Business & Investments",
    items: [
      { name: "Business", icon: <Store className="h-4 w-4 mr-2" /> },
      { name: "Investments", icon: <DollarSign className="h-4 w-4 mr-2" /> },
      { name: "Rent Income", icon: <Building2 className="h-4 w-4 mr-2" /> },
    ],
  },
  {
    group: "Financial",
    items: [
      { name: "Loan Received", icon: <Users className="h-4 w-4 mr-2" /> },
    ],
  },
  {
    group: "Other",
    items: [{ name: "Other Income", icon: <File className="h-4 w-4 mr-2" /> }],
  },
];

interface EditTransactionFormProps {
  transaction: {
    id: number;
    amount: string;
    transactionType: string;
    category: { name: string };
    date: string;
    remarks?: string;
  };
  onClose: () => void;
  darkMode?: boolean;
}

const EditTransactionForm = ({
  transaction,
  onClose,
  darkMode = false,
}: EditTransactionFormProps) => {
  const [state, formAction] = useFormState(editTransaction, initialState);
  const [transactionType, setTransactionType] = useState(
    transaction.transactionType.toLowerCase()
  );
  const [date, setDate] = useState(new Date(transaction.date));
  const [searchTerm, setSearchTerm] = useState("");
  const [amount, setAmount] = useState(transaction.amount);
  const [selectedCategory, setSelectedCategory] = useState(
    transaction.category.name
  );
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    amountInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (state.message === "success") {
      onClose();
      queryClient.invalidateQueries({
        queryKey: ["transactionForCurrentMonth"],
      });
    }
  }, [state.message, onClose, queryClient]);

  const handleTypeChange = (
    e: React.MouseEvent<HTMLButtonElement>,
    type: string
  ) => {
    e.preventDefault();
    setTransactionType(type);
    setSearchTerm("");
    setSelectedCategory("");
    setIsSearchFocused(false);
  };

  const handleSubmit = (e) => {
    if (!e.nativeEvent.submitter) {
      e.preventDefault();
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
      setAmount(value);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isSearchFocused && e.target.value.trim() !== "") {
      setIsSearchFocused(true);
    }
  };

  const getFilteredCategories = () => {
    const categoriesArray =
      transactionType === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

    if (!searchTerm.trim()) return categoriesArray;

    const searchTermLower = searchTerm.toLowerCase().trim();

    return categoriesArray
      .map((group) => {
        const filteredItems = group.items.filter((item) =>
          item.name.toLowerCase().includes(searchTermLower)
        );

        return filteredItems.length > 0
          ? {
              group: group.group,
              items: filteredItems,
            }
          : null;
      })
      .filter(Boolean);
  };

  const getRelativeDateDisplay = (selectedDate) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (selectedDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (selectedDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return format(selectedDate, "PPP");
    }
  };

  const setToday = () => setDate(new Date());
  const setYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setDate(yesterday);
  };
  const setLastWeek = () => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    setDate(lastWeek);
  };

  const filteredCategories = getFilteredCategories();

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      ref={formRef}
      className="space-y-4"
    >
      <input type="hidden" name="id" value={transaction.id} />

      <div className="flex justify-around mb-6">
        <button
          type="button"
          className={`px-6 py-2 rounded-full transition-colors flex items-center ${
            transactionType === "expense"
              ? "bg-red-500 text-white"
              : darkMode
              ? "bg-gray-700 text-gray-300"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={(e) => handleTypeChange(e, "expense")}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Expense
        </button>
        <button
          type="button"
          className={`px-6 py-2 rounded-full transition-colors flex items-center ${
            transactionType === "income"
              ? "bg-green-500 text-white"
              : darkMode
              ? "bg-gray-700 text-gray-300"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={(e) => handleTypeChange(e, "income")}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Income
        </button>
      </div>
      <input type="hidden" name="type" value={transactionType} />

      <div className="space-y-3">
        <label
          className={`block text-sm font-medium ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            name="amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            required
            ref={amountInputRef}
            className={`pl-10 text-lg font-medium ${
              amount
                ? transactionType === "expense"
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
                : ""
            } ${
              darkMode
                ? "bg-gray-700 text-white placeholder-gray-400"
                : "bg-gray-100 text-gray-800 placeholder-gray-500"
            }`}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label
          className={`block text-sm font-medium ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Category
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {searchTerm ? (
              <Search className="h-5 w-5 text-gray-400" />
            ) : selectedCategory ? (
              (transactionType === "expense"
                ? EXPENSE_CATEGORIES.flatMap((g) => g.items)
                : INCOME_CATEGORIES.flatMap((g) => g.items)
              ).find((c) => c.name === selectedCategory)?.icon || (
                <Search className="h-5 w-5 text-gray-400" />
              )
            ) : (
              <Search className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <Input
            type="text"
            placeholder={
              selectedCategory
                ? ""
                : "Search categories... (Press '/' to focus)"
            }
            value={
              searchTerm ||
              (selectedCategory && !isSearchFocused ? selectedCategory : "")
            }
            onChange={handleSearchChange}
            onFocus={() => {
              setIsSearchFocused(true);
              if (selectedCategory && !searchTerm) {
                setSearchTerm("");
              }
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsSearchFocused(false);
                if (!searchTerm) {
                  setSearchTerm("");
                }
              }, 200);
            }}
            ref={searchInputRef}
            className={`pl-10 border-2 ${
              isSearchFocused
                ? "border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/30"
                : selectedCategory
                ? "border-gray-300 dark:border-gray-600"
                : ""
            } ${
              darkMode
                ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                : "bg-gray-100 text-gray-800 placeholder-gray-500 border-gray-200"
            } ${searchTerm || selectedCategory ? "pr-10" : ""}`}
          />
          {(searchTerm || selectedCategory) && (
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                searchInputRef.current?.focus();
              }}
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </div>
          )}

          {(isSearchFocused || searchTerm) && (
            <div
              className={`absolute z-50 w-full mt-1 border rounded-md overflow-hidden shadow-md max-h-60 overflow-y-auto ${
                darkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-white"
              }`}
            >
              {filteredCategories.length === 0 ? (
                <p className="text-sm text-gray-500 p-3 text-center">
                  No matching categories found
                </p>
              ) : (
                filteredCategories.map((group, groupIndex) => (
                  <div key={groupIndex}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                      {group.group}
                    </div>
                    {group.items.map((cat) => (
                      <div
                        key={cat.name}
                        className={`px-3 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          selectedCategory === cat.name
                            ? "bg-blue-50 dark:bg-blue-900/30"
                            : ""
                        }`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setSelectedCategory(cat.name);
                          setSearchTerm("");
                          setIsSearchFocused(false);
                        }}
                      >
                        {cat.icon}
                        <span className="ml-1">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <label
          className={`block text-sm font-medium ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Date
        </label>
        <div className="flex items-center space-x-2 mb-2">
          <Button
            type="button"
            size="sm"
            onClick={setToday}
            variant="outline"
            className={`text-xs ${
              date.toDateString() === new Date().toDateString()
                ? "bg-blue-100"
                : ""
            }`}
          >
            Today
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={setYesterday}
            variant="outline"
            className="text-xs"
          >
            Yesterday
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={setLastWeek}
            variant="outline"
            className="text-xs"
          >
            Last Week
          </Button>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground",
                darkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-800"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? getRelativeDateDisplay(date) : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <input type="hidden" name="date" value={date.toISOString()} />
      </div>

      <div className="space-y-3">
        <label
          className={`block text-sm font-medium ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Remarks
        </label>
        <Textarea
          name="remarks"
          placeholder="Add notes about this transaction"
          defaultValue={transaction.remarks || ""}
          className={`${
            darkMode
              ? "bg-gray-700 text-white placeholder-gray-400"
              : "bg-gray-100 text-gray-800 placeholder-gray-500"
          }`}
          rows={3}
        />
      </div>

      {/* Transaction preview */}
      {amount && (
        <div
          className={`p-3 rounded-md border ${
            transactionType === "expense"
              ? "border-red-200 bg-red-50"
              : "border-green-200 bg-green-50"
          }`}
        >
          <p className="text-sm font-medium">Transaction Preview</p>
          <div className="flex justify-between items-center mt-1">
            <p
              className={`text-lg font-bold ${
                transactionType === "expense"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {transactionType === "expense" ? "-" : "+"} Rs. {amount}
            </p>
            {selectedCategory && (
              <span className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
                {selectedCategory}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {getRelativeDateDisplay(date)}
          </p>
        </div>
      )}

      {/* Hidden select for form submission */}
      <div className="hidden">
        <Select
          name="category"
          required
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {(transactionType === "expense"
              ? EXPENSE_CATEGORIES
              : INCOME_CATEGORIES
            ).map((group) =>
              group.items.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className={`flex-1 ${
            transactionType === "expense"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white`}
          disabled={!amount || !selectedCategory}
        >
          {state.message === "pending" ? "Updating..." : "Update Transaction"}
        </Button>
      </div>

      {state.error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default EditTransactionForm;
