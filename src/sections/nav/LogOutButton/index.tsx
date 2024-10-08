"use client";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";

const LogoutButton = () => {
  const darkMode = false;
  return (
    <button
      className={`p-2 rounded-full ${
        darkMode
          ? "text-orange-400 hover:bg-gray-700"
          : "text-orange-600 hover:bg-orange-100"
      } transition-colors`}
      onClick={() => signOut()}
    >
      <LogOut className="w-6 h-6" />
    </button>
  );
};

export default LogoutButton;
