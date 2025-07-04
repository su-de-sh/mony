"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
  title?: string;
}

export const FloatingActionButton = ({
  onClick,
  className,
  children,
  title = "Add Transaction",
}: FloatingActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "sticky bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50",
        "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white",
        "flex items-center justify-center",
        "border-0 focus:ring-4 focus:ring-orange-200 focus:outline-none",
        "group relative p-0",
        className
      )}
      size="lg"
      title={title}
    >
      <div className="flex items-center justify-center w-full h-full">
        {children || (
          <Plus className="h-7 w-7 transition-transform group-hover:rotate-90" />
        )}
      </div>

      {/* Tooltip */}
      <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        {title}
        <span className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></span>
      </span>
    </Button>
  );
};
