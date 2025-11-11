import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { newLog } from "../../api";
import { ISetTask } from "../../types";

export const useSetNewLog = () => {
  const { showError, showSuccess } = useNotifications();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (body: ISetTask) => newLog(body),
    onSuccess: () => {
      showSuccess("Запись успешно создана");
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
    onError: (error: Error) => {
      showError(error.message || "Ошибка создания записи");
    },
  });

  return {
    newLog: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
  };
};
