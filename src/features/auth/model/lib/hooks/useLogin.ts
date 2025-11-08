import { useState } from "react";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { ILoginRequest } from "../types";
import { login } from "../api";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { showError, showSuccess } = useNotifications();

  const fetchLogin = async (body: ILoginRequest) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      await login(body);
      showSuccess("Вы успешно вошли");
      window.location.pathname = "/";
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err.message : "Ошибка при авторизации");
      showError(err instanceof Error ? err.message : "Ошибка при авторизации");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, isError, error, login: fetchLogin };
};
