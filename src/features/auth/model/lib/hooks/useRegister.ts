import { useMutation } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { register } from "../../api";

export const useRegister = () => {
  const { showError, showSuccess } = useNotifications();

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      showSuccess("Вы успешно зарегистрировались");
      window.location.pathname = "/auth/login";
    },
    onError: (error: Error) => {
      showError(error.message || "Ошибка при регистрации");
    },
  });

  return {
    register: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
  };
};
