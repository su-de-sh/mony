import { useQuery } from "@tanstack/react-query";

const usePreviousMonthData = (currentMonth) => {
  const prevMonth = new Date(currentMonth);
  prevMonth.setMonth(prevMonth.getMonth() - 1);

  return useQuery({
    queryKey: ["previousMonthTransactions", prevMonth.toISOString()],
    queryFn: async () => {
      const month = prevMonth.getMonth() + 1; // JavaScript months are 0-indexed
      const year = prevMonth.getFullYear();

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

export default usePreviousMonthData;
