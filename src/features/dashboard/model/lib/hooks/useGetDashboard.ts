import { useQuery } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { getDashboard } from "../api";

export const useGetDashboard = () => {
  const { showError } = useNotifications();

  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  if (query.isError && query.error) {
    showError(query.error.message || "Ошибка получения дашбордов");
  }

  return {
    dashboard: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};
