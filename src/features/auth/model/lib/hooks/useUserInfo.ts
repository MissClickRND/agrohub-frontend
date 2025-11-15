import { useQuery } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { checkOrganization, createOrganizations, userInfo } from "../../api";
import { useMeStore } from "../../../../../entities/me/model/meStore";

function generateRandomString(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

export const useUserInfo = () => {
  const { setUserName } = useMeStore();
  const { showError } = useNotifications();

  const query = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      try {
        // const data = await userInfo();
        const check = await checkOrganization();
        // setUserName(data.user.username);

        if (!check) {
          createOrganizations(generateRandomString());
        }

        // return data;
      } catch (error) {
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
