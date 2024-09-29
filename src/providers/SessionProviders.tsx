"use client";

import { SessionProvider } from "next-auth/react";

const SessionProviders = ({ children }) => {
  console.log("[SessionProviders.tsx--[6]], ");
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionProviders;
