"use client";
import { useAppContext } from "@/contexts";
import { usePathname } from "next/navigation";
import React from "react";

const DashboardContentWrapper = ({ children }) => {
  const { isSideNavBarOpen } = useAppContext();
  const pathname = usePathname();

  // Check if current page is dashboard home
  const isDashboardHome = pathname === "/dashboard";

  return (
    <div className="relative">
      <div
        className={`hidden md:block min-h-screen ${
          isDashboardHome ? "overflow-hidden" : "overflow-auto"
        } transition-all duration-300
        ${
          isSideNavBarOpen
            ? "ml-64 w-[calc(100vw-16rem)]"
            : "ml-16 w-[calc(100vw-4rem)]"
        }`}
        style={{ zIndex: 0 }}
      >
        {children}
      </div>
      <div className="md:hidden">{children}</div>
    </div>
  );
};

export default DashboardContentWrapper;
