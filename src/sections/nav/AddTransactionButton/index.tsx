"use client";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useAppContext } from "@/contexts";

const AddTransactionButton = () => {
  const { setIsAddingTransaction } = useAppContext();

  return (
    <motion.button
      className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg -mt-8"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setIsAddingTransaction(true)}
    >
      <Plus className="w-8 h-8 text-white" />
    </motion.button>
  );
};

export default AddTransactionButton;
