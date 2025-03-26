"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addTransaction } from "@/app/actions/transaction";
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
import { CalendarIcon } from "lucide-react";
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
      disabled={pending}
    >
      {pending ? "Adding..." : "Add Transaction"}
    </Button>
  );
}

const TransactionForm = ({ darkMode, categories, setIsAddingTransaction }) => {
  const [state, formAction] = useFormState(addTransaction, initialState);
  const [transactionType, setTransactionType] = useState("expense");
  const [date, setDate] = useState(new Date());
  const formRef = useRef<HTMLFormElement>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (state.message === "success") {
      setIsAddingTransaction(false);
      formRef.current?.reset();
      queryClient.invalidateQueries({
        queryKey: ["transactionForCurrentMonth"],
      });
    }
  }, [state.message, setIsAddingTransaction]);

  const handleTypeChange = (
    e: React.MouseEvent<HTMLButtonElement>,
    type: string
  ) => {
    e.preventDefault();
    setTransactionType(type);
  };

  const handleSubmit = (e) => {
    if (!e.nativeEvent.submitter) {
      e.preventDefault();
    }
  };

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      ref={formRef}
      className="space-y-4"
    >
      <div className="flex justify-around mb-6">
        <button
          type="button"
          className={`px-6 py-2 rounded-full transition-colors ${
            transactionType === "expense"
              ? "bg-red-500 text-white"
              : darkMode
              ? "bg-gray-700 text-gray-300"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={(e) => handleTypeChange(e, "expense")}
        >
          Expense
        </button>
        <button
          type="button"
          className={`px-6 py-2 rounded-full transition-colors ${
            transactionType === "income"
              ? "bg-green-500 text-white"
              : darkMode
              ? "bg-gray-700 text-gray-300"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={(e) => handleTypeChange(e, "income")}
        >
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
        <Input
          name="amount"
          type="number"
          placeholder="Enter amount"
          required
          className={`${
            darkMode
              ? "bg-gray-700 text-white placeholder-gray-400"
              : "bg-gray-100 text-gray-800 placeholder-gray-500"
          }`}
        />
      </div>

      <div className="space-y-3">
        <label
          className={`block text-sm font-medium ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Category
        </label>
        <Select name="category" required>
          <SelectTrigger
            className={`${
              darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          >
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent
            ref={(ref) => {
              if (!ref) return;
              ref.ontouchstart = (e) => {
                e.preventDefault();
              };
            }}
          >
            {categories
              ?.filter((cat) => cat.type.toLowerCase() === transactionType)
              .map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <label
          className={`block text-sm font-medium ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Date
        </label>
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
              {date ? format(date, "PPP") : <span>Pick a date</span>}
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
          className={`${
            darkMode
              ? "bg-gray-700 text-white placeholder-gray-400"
              : "bg-gray-100 text-gray-800 placeholder-gray-500"
          }`}
          rows={3}
        />
      </div>

      <SubmitButton />
      {state.error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default TransactionForm;
