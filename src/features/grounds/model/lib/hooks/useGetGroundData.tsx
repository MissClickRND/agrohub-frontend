// features/grounds/model/lib/hooks/useGetGroundData.ts
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { getGroundData } from "../api";

export const useGetGroundData = (id?: number) => {
  const { showError } = useNotifications();

  const query = useQuery({
    queryKey: ["groundData", id],
    queryFn: () => getGroundData(id!),
    enabled: typeof id === "number",
    staleTime: 60_000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });

  useEffect(() => {
    if (query.isError && query.error) {
      const msg =
        (query.error as any)?.message ||
        (query.error as any)?.response?.data?.message ||
        "Ошибка получения данных";
      showError(msg);
    }
  }, [query.isError]);

  return {
    groundData: (query.data as any) ?? null,
    isLoading: query.isPending,
    isError: query.isError,
    error: (query.error as any)?.message || null,
    refetch: query.refetch,
  };
};
