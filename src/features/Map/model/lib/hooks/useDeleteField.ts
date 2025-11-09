import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { deleteField } from "../../api";

export const useDeleteField = () => {
  const { showError, showSuccess } = useNotifications();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteField,
    onSuccess: () => {
      showSuccess("Поле успешно удалено");
      queryClient.invalidateQueries({ queryKey: ["fields"] });
    },
    onError: (error: Error) => {
      showError(error.message || "Ошибка удаления поля");
    },
  });

  return {
    deleteField: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
  };
};
