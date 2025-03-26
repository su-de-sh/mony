"use client";
import TransactionForm from "@/components/organism/transaction/TransactionForm";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "@/contexts";

const AddTransactionWidget = () => {
  const { isAddingTransaction, setIsAddingTransaction } =
    useContext(AppContext);

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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]"
          onClick={handleClose}
          style={{ isolation: "isolate" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl z-[10000]"
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative" }}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-orange-600">
                Add Transaction
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <TransactionForm setIsAddingTransaction={setIsAddingTransaction} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddTransactionWidget;
