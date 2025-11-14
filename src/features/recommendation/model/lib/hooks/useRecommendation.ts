import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";

import { recommendation } from "../api";
import { IRecommendationRequest } from "../type";

export const useRecommendation = () => {
  const { showError, showSuccess } = useNotifications();

  const mutation = useMutation({
    mutationFn: (body: IRecommendationRequest) => recommendation(body),
    onError: (error: Error) => {
      showError(error.message || "Ошибка создания рекомендаций");
    },
  });

  return {
    recommendation: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
  };
};
