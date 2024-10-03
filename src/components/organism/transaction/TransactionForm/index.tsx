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

const TransactionForm = ({
  darkMode,
  categories,
  setIsAddingTransaction,
  refetch,
}) => {
  const [state, formAction] = useFormState(addTransaction, initialState);
  const [transactionType, setTransactionType] = useState("expense");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message === "success") {
      setIsAddingTransaction(false);
      formRef.current?.reset();
      refetch();
    }
  }, [state.message, setIsAddingTransaction, refetch]);

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
    <form action={formAction} onSubmit={handleSubmit} ref={formRef}>
      <div className="flex justify-around mb-4">
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
      <Input
        name="amount"
        type="number"
        placeholder="Amount"
        required
        className={`mb-4 ${
          darkMode
            ? "bg-gray-700 text-white placeholder-gray-400"
            : "bg-gray-100 text-gray-800 placeholder-gray-500"
        }`}
      />
      <Select name="category" required>
        <SelectTrigger
          className={`mb-4 ${
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
