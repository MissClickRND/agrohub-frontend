import apiClient from "../../../../app/api/axiosInstance";
import { API, endpoints } from "../../../../shared/configs/apiConfigs";

export const getDashboard = async () => {
  const res = await apiClient.get(API + endpoints.GET_DASHBOARD);
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка получения дашбордов");
  return res.data;
};

export const getNPKDashboard = async (id: number) => {
  const res = await apiClient.get(API + endpoints.GET_NPK_DASHBOARD(id));
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка получения npk дашбордов");
  return res.data;
};
