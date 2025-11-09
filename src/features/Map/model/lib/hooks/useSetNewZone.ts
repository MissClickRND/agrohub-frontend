import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { newZone } from "../../api";
import { Zone } from "../../types";

export const useSetNewZone = (fieldId?: number) => {
  const { showError, showSuccess } = useNotifications();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (body: Zone) => newZone({ body, id: fieldId }),
    onSuccess: () => {
      showSuccess("Зона успешно создана");
      if (fieldId) {
        queryClient.invalidateQueries({ queryKey: ["zones", fieldId] });
      }
    },
    onError: (error: Error) => {
      showError(error.message || "Ошибка создания зоны");
    },
  });

  return {
    newZone: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
  };
};
