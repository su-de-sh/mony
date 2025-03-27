"use client";
import { useAppContext } from "@/contexts";
import React from "react";

const DashboardContentWrapper = ({ children }) => {
  const { isSideNavBarOpen } = useAppContext();
  return (
    <div>
      <div
        className={` hidden md:block  h-screen overflow-auto   transition-all duration-300
   ${isSideNavBarOpen ? "ml-64 w-[100vw-16rem]" : " ml-16 w-[100vw-4rem]"}
    
    `}
      >
        {children}
      </div>
      <div className="md:hidden">{children}</div>
    </div>
  );
};

export default DashboardContentWrapper;
