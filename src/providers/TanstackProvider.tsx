"use client";

import React, { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import config from "@/hooks/reactQueryConfig";

export const TanStackProvider = ({ children }) => {
  const [client] = useState(new QueryClient({ defaultOptions: config }));

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
