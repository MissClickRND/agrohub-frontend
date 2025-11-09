import { useQuery } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { getZones } from "../../api";

export const useGetZones = (id?: number) => {
  const { showError } = useNotifications();

  const query = useQuery({
    queryKey: ["zones", id],
    queryFn: () => getZones(id as number),
    enabled: !!id,
  });

  if (query.isError && query.error) {
    showError(query.error.message || "Ошибка получения зон поля");
  }

  return {
    zones: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};
