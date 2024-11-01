import MobileDashboard from "@/sections/dashboard";
import React, { Suspense } from "react";

const DashboardPage = () => {
  return (
    <Suspense>
      <MobileDashboard />
    </Suspense>
  );
};

export default DashboardPage;
