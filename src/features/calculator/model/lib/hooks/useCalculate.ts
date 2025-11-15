import { useMutation } from "@tanstack/react-query";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { calculate } from "../../api";
import { ICalculateReq, ICalculateRes } from "../../types";
import { useEffect } from "react";

export const useCalculate = (body: ICalculateReq) => {
  const { showError } = useNotifications();
  const mutation = useMutation<ICalculateRes>({
    mutationFn: () => calculate(body),
    onError: (e: Error) => showError(e.message || "Ошибка при расчётах"),
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
    data: mutation.data,
  };
};
