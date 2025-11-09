import { useQuery } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { getFields } from "../../api";
import { useEffect } from "react";

export const useGetFields = () => {
  const { showError } = useNotifications();
  const query = useQuery({
    queryKey: ["fields"],
    queryFn: getFields,
  });

  useEffect(() => {
    if (query.isError && query.error) {
      showError(query.error.message || "Ошибка получения полей");
    }
  }, [query.isError, query.error, showError]);

  return {
    fields: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};
