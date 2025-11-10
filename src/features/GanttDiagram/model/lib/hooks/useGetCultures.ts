import { useQuery } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { getCulturesList } from "../../api";

export const useGetCulture = () => {
  const { showError } = useNotifications();

  const query = useQuery({
    queryKey: ["culture"],
    queryFn: getCulturesList,
  });

  if (query.isError && query.error) {
    showError(query.error.message || "Ошибка получения культур");
  }

  return {
    cultures: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};
