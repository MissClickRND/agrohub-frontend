import { useQuery } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { getNPKDashboard } from "../api";

export const useGetNpkDashboard = (id: number | null) => {
  const { showError } = useNotifications();

  const query = useQuery({
    queryKey: ["dashboardNPK", id],
    queryFn: () => getNPKDashboard(id as number),
    enabled: !!id,
  });

  if (query.isError && query.error) {
    showError(query.error.message || "Ошибка получения дашбордов NPK");
  }

  return {
    dashboardNPK: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};
