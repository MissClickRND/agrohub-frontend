import { useQuery } from "@tanstack/react-query";
import { getZones } from "../../api";

export const useGetZones = (id?: number) => {
  const query = useQuery({
    queryKey: ["zones", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return [];

      try {
        const data = await getZones(id);
        return data;
      } catch (err: any) {
        const status =
          err?.response?.status ??
          err?.status ??
          err?.cause?.status ??
          err?.code;

        // 404 — считаем, что зон просто нет
        if (status === 404 || status === "404") {
          return [];
        }

        // остальные ошибки отдаем наверх как error state
        throw err;
      }
    },
    retry: (failureCount, error: any) => {
      const status =
        error?.response?.status ??
        error?.status ??
        error?.cause?.status ??
        error?.code;

      // на 404 не ретраим вообще
      if (status === 404 || status === "404") return false;

      // остальные — максимум 2 попытки
      return failureCount < 2;
    },
  });

  return {
    zones: (query.data ?? []) as any[],
    isLoading: query.isPending,
    isError: query.isError,
    error: query.isError
      ? query.error?.message || "Ошибка получения зон поля"
      : null,
    refetch: query.refetch,
  };
};
