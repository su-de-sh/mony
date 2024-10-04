"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const AddTransactionButton = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const setParams = () => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("isAddingTransaction", "true");

    const newUrl = `${pathname}?${currentParams.toString()}`;

    router.push(newUrl);
  };

  return (
    <motion.button
      className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg -mt-8"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setParams()}
    >
      <Plus className="w-8 h-8 text-white" />
    </motion.button>
  );
};

export default AddTransactionButton;
