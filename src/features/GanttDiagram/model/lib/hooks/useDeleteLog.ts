import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { deleteLog } from "../../api";

export const useDeleteLog = () => {
  const qc = useQueryClient();
  const { showError, showSuccess } = useNotifications();

  const mutation = useMutation({
    mutationFn: (id: number | null) => deleteLog(id),
    onSuccess: (_res, id) => {
      showSuccess("Запись удалена");
      qc.invalidateQueries({ queryKey: ["logs"] });
    },
    onError: (e: Error) => showError(e.message || "Ошибка удаления записи"),
  });

  return {
    deleteLog: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
  };
};
