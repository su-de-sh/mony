import Dashboard from "@/sections/dashboard";
import React, { Suspense } from "react";

const DashboardPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
};

export default DashboardPage;
