"use client";

import { useAppContext } from "@/contexts";
import { FloatingActionButton } from "@/components/ui/floating-action-button";

export const FloatingAddButton = () => {
  const { setIsAddingTransaction } = useAppContext();

  return (
    <FloatingActionButton
      onClick={() => setIsAddingTransaction(true)}
      className=" hidden md:block bottom-20 md:bottom-8 mb-4 md:mb-0" // Account for mobile navbar
      title="Add Transaction"
    />
  );
};
