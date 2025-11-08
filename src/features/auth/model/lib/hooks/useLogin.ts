import { useMutation } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { login } from "../../api";

export const useLogin = () => {
  const { showError, showSuccess } = useNotifications();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      showSuccess("Вы успешно вошли");
      window.location.pathname = "/";
    },
    onError: (error: Error) => {
      showError(error.message || "Ошибка при авторизации");
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
  };
};
