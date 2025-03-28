import { useQuery } from "@tanstack/react-query";

export const useTransaction = (currentMonth) => {
  const month = currentMonth.getMonth() + 1; // JavaScript months are 0-indexed
  const year = currentMonth.getFullYear();

  return useQuery({
    queryKey: ["transactionForCurrentMonth", `${year}-${month}`],
    queryFn: async () => {
      const response = await fetch(
        `/api/transactions?month=${month}&year=${year}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
