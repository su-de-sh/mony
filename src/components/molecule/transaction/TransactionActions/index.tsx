"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import EditTransactionForm from "../../../organism/transaction/EditTransactionForm";
import { useTransactionActions } from "@/hooks/useTransactionActions";

interface TransactionActionsProps {
  transaction: {
    id: number;
    amount: string;
    transactionType: string;
    category: { name: string };
    date: string;
    remarks?: string;
  };
  darkMode?: boolean;
}

const TransactionActions = ({ transaction, darkMode = false }: TransactionActionsProps) => {
  const [showEditSheet, setShowEditSheet] = useState(false);
  const { deleteTransaction, isDeleting } = useTransactionActions();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this ${transaction.transactionType === "INCOME" ? "income" : "expense"} transaction for $${transaction.amount}?`)) {
      deleteTransaction(transaction.id.toString());
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${
              darkMode
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => setShowEditSheet(true)}
            className="cursor-pointer"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={isDeleting}
            className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Sheet */}
      <Sheet open={showEditSheet} onOpenChange={setShowEditSheet}>
        <SheetContent className="w-full max-w-md">
          <SheetHeader>
            <SheetTitle className="text-orange-600">
              Edit Transaction
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <EditTransactionForm
              transaction={transaction}
              onClose={() => setShowEditSheet(false)}
              darkMode={darkMode}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default TransactionActions;
