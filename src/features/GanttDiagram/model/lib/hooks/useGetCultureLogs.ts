import { useQuery } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { getCultureLogs } from "../../api";

export type CultureLog = {
  id: number;
  text: string;
  type: "summary" | "task" | string;
  start?: string;
  end?: string;
  parent?: number;
};

export const useGetCultureLogs = (id?: number) => {
  const { showError } = useNotifications();

  const query = useQuery<CultureLog[], Error>({
    queryKey: ["logs", id],
    queryFn: () => getCultureLogs(id as number),
    enabled: !!id,
  });

  if (query.isError && query.error) {
    showError(query.error.message || "Ошибка получения логов поля");
  }

  return {
    cultureLogs: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};
