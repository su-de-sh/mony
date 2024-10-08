"use client";
import { Home } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const HomeButton = () => {
  const darkMode = false;

  const searchParams = useSearchParams();

  const currentParams = new URLSearchParams(searchParams);
  const currentMonth = currentParams.get("currentMonth");

  return (
    <Link href={`/dashboard?currentMonth=${currentMonth}`}>
      <button
        className={`p-2 rounded-full ${
          darkMode
            ? "text-orange-400 hover:bg-gray-700"
            : "text-orange-600 hover:bg-orange-100"
        } transition-colors`}
      >
        <Home className="text-orange-500" />
      </button>
    </Link>
  );
};

export default HomeButton;
