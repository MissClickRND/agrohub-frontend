import { useQuery } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { getGroundData } from "../api";

export const useGetCulture = (id?: number) => {
  const { showError } = useNotifications();

  const query = useQuery({
    queryKey: ["groundData"],
    queryFn: () => getGroundData(id as number),
  });

  if (query.isError && query.error) {
    showError(query.error.message || "Ошибка получения данных");
  }

  return {
    groundData: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};
