"use client";
import { BarChart2 } from "lucide-react";
import Link from "next/link";

const AnalyticsButton = () => {
  const darkMode = false;
  return (
    <Link href={`/dashboard/analytics`}>
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
