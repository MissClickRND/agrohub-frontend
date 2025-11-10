import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { deleteZone } from "../../api";

export const useDeleteZone = () => {
  const qc = useQueryClient();
  const { showError, showSuccess } = useNotifications();

  const mutation = useMutation({
    mutationFn: (id?: number) => deleteZone(id),
    onSuccess: (_res, id) => {
      showSuccess("Поле удалено");
      qc.invalidateQueries({ queryKey: ["zones"] });
    },
    onError: (e: Error) => showError(e.message || "Ошибка удаления зоны"),
  });

  return {
    deleteZone: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
  };
};
