import { useQuery } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { getFields } from "../../api";

export const useGetFields = () => {
  const { showError } = useNotifications();

  const query = useQuery({
    queryKey: ["fields"],
    queryFn: getFields,
  });

  if (query.isError && query.error) {
    // без useEffect — чтобы не ловить гонки, Mantine нотификация безопасна
    showError(query.error.message || "Ошибка получения полей");
  }

  return {
    fields: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};
