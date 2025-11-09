import { useMutation } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { newField } from "../../api";

export const useSetNewField = () => {
  const { showError, showSuccess } = useNotifications();

  const mutation = useMutation({
    mutationFn: newField,
    onSuccess: () => {
      showSuccess("Поле успешно создано");
    },
    onError: (error: Error) => {
      showError(error.message || "Ошибка создания поля");
    },
  });

  return {
    newField: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
  };
};
