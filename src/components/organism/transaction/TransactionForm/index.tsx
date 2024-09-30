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

const TransactionForm = ({ darkMode, categories }) => {
  const [state, formAction] = useFormState(addTransaction, initialState);
  const [transactionType, setTransactionType] = useState("expense");

  const formRef = useRef<HTMLFormElement>();

  useEffect(() => {
    if (state.message === "success") {
      formRef.current.reset();
    }
  }, [state.message]);

  return (
    <form action={formAction} ref={formRef}>
      <div className="flex justify-around mb-4">
        <button
          className={`px-6 py-2 rounded-full transition-colors ${
            transactionType === "expense"
              ? "bg-red-500 text-white"
              : darkMode
              ? "bg-gray-700 text-gray-300"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setTransactionType("expense")}
        >
          Expense
        </button>
        <button
          className={`px-6 py-2 rounded-full transition-colors ${
            transactionType === "income"
              ? "bg-green-500 text-white"
              : darkMode
              ? "bg-gray-700 text-gray-300"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setTransactionType("income")}
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
        >
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
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
