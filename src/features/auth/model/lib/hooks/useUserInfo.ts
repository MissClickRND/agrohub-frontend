import { useQuery } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { userInfo } from "../../api";
import { useMeStore } from "../../../../../entities/me/model/meStore";

export const useUserInfo = () => {
  const { setUserName } = useMeStore();
  const { showError } = useNotifications();

  const query = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      try {
        const data = await userInfo();
        setUserName(data.user.username);

        return data;
      } catch (error) {
        showError(
          error instanceof Error
            ? error.message
            : "Ошибка при подтверждении пользователя"
        );
        throw error;
      }
    },
    enabled: false,
    retry: false,
  });

  return {
    userInfo: query.refetch,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error?.message || null,
    data: query.data,
  };
};
