import Dashboard from "@/sections/dashboard";
import React, { Suspense } from "react";

const DashboardPage = () => {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
};

export default DashboardPage;
