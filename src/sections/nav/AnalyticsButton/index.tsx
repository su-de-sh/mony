"use client";

import { BarChart2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const AnalyticsButton = () => {
  const darkMode = false;
  const searchParams = useSearchParams();

  const currentParams = new URLSearchParams(searchParams);
  const currentMonth = currentParams.get("currentMonth");

  return (
    <Link href={`/dashboard/analytics?currentMonth=${currentMonth}`}>
      <button
        className={`p-2 rounded-full ${
          darkMode
            ? "text-orange-400 hover:bg-gray-700"
            : "text-orange-600 hover:bg-orange-100"
        } transition-colors`}
      >
        <BarChart2 className="w-6 h-6" />
      </button>
    </Link>
  );
};

export default AnalyticsButton;
