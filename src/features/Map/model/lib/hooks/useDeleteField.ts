import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { deleteField } from "../../api";

export const useDeleteField = () => {
  const qc = useQueryClient();
  const { showError, showSuccess } = useNotifications();

  const mutation = useMutation({
    mutationFn: (id?: number) => deleteField(id),
    onSuccess: (_res, id) => {
      showSuccess("Поле удалено");
      qc.invalidateQueries({ queryKey: ["fields"] });
      if (id) qc.invalidateQueries({ queryKey: ["zones", id] });
    },
    onError: (e: Error) => showError(e.message || "Ошибка удаления поля"),
  });

  return {
    deleteField: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
  };
};
