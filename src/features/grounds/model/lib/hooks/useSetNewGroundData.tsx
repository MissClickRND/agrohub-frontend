import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";

import { GroundData } from "../types";
import { newGroundData } from "../api";

export const useSetNewGroundData = () => {
  const { showError, showSuccess } = useNotifications();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (body: GroundData) => newGroundData(body),
    onSuccess: () => {
      showSuccess("Данные добавлены в таблицу");
      queryClient.invalidateQueries({ queryKey: ["groundData"] });
    },
    onError: (error: Error) => {
      showError(error.message || "Ошибка добавления данных");
    },
  });

  return {
    newGroundData: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
  };
};
