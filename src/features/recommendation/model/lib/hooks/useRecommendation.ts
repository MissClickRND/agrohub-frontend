import { useMutation } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { recommendation } from "../api";
import type { IRecommendationRequest } from "../type";

export const useRecommendation = () => {
  const { showError } = useNotifications();

  const mutation = useMutation<any, Error, IRecommendationRequest>({
    mutationFn: (body) => recommendation(body),
    onError: (error) => {
      showError(error.message || "Ошибка получения рекомендаций");
    },
  });

  return {
    recommend: mutation.mutate,
    recommendAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
  };
};
