import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { deleteGroundData } from "../api";

export const useDeleteGroundData = () => {
  const qc = useQueryClient();
  const { showError, showSuccess } = useNotifications();

  const mutation = useMutation({
    mutationFn: (id: number | null) => deleteGroundData(id),
    onSuccess: (_res, id) => {
      showSuccess("Запись удалена");
      qc.invalidateQueries({ queryKey: ["groundData"] });
    },
    onError: (e: Error) => showError(e.message || "Ошибка удаления записи"),
  });

  return {
    deleteGroundData: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
  };
};
