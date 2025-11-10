import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { updateLog } from "../../api";
import { GanttTask } from "../../types";

export const useUpdateLog = () => {
  const { showError, showSuccess } = useNotifications();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ body, id }: { body: GanttTask; id: number }) =>
      updateLog({ body, id }),
    onSuccess: () => {
      showSuccess("Запись успешно обновлена");
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
    onError: (error: Error) => {
      showError(error.message || "Ошибка обновления записи");
    },
  });

  return {
    updateLog: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
  };
};
