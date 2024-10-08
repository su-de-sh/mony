import { useQuery } from "@tanstack/react-query";

export const useTransaction = (currentMonth) =>
  useQuery({
    queryKey: ["transactionForCurrentMonth", currentMonth],
    queryFn: () =>
      fetch(`/api/transactions?currentMonth=${currentMonth.toISOString()}`, {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json()),
  });
