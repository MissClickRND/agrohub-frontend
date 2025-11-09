import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { newZone } from "../../api";

export const useSetNewZone = () => {
  const { showError, showSuccess } = useNotifications();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: newZone,
    onSuccess: () => {
      showSuccess("Зона успешна создана");
      queryClient.invalidateQueries({ queryKey: ["zones"] });
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
