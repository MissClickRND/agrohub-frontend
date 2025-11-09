import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { newField } from "../../api";
import { Field } from "../../types";

export const useSetNewField = () => {
  const { showError, showSuccess } = useNotifications();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (body: Field) => newField(body),
    onSuccess: () => {
      showSuccess("Поле успешно создано");
      queryClient.invalidateQueries({ queryKey: ["fields"] });
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
