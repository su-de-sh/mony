"use client";
import TransactionForm from "@/components/organism/transaction/TransactionForm";
import { CATEGORIES } from "@/constants/categories";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAppContext } from "@/contexts";

const AddTransactionWidget = () => {
  const { isAddingTransaction, setIsAddingTransaction } = useAppContext();

  const darkMode = false;

  const handleClose = () => {
    setIsAddingTransaction(false);
  };

  return (
    <AnimatePresence>
      {isAddingTransaction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-xl w-full max-w-md`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className={`text-xl font-bold ${
                  darkMode ? "text-orange-400" : "text-orange-600"
                }`}
              >
                Add Transaction
              </h3>
              <button
                onClick={handleClose}
                className={`${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <TransactionForm
              darkMode={darkMode}
              categories={CATEGORIES}
              setIsAddingTransaction={setIsAddingTransaction}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddTransactionWidget;
