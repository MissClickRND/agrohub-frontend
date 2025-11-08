import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API } from "../../shared/configs/apiConfigs";

//Используется теперь с каждым запросом где нужна проверка на 401
const apiClient = axios.create({
  baseURL: API,
  withCredentials: true,
});

let isRefreshing = false;

// Расширяем конфиг, чтобы пометить, что запрос уже повторялся
declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    if (error?.response?.status == 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Запрос на обновление токена
        await apiClient.get("/refresh");

        // Повторяем оригинальный запрос
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Обновление не удалось — перенаправляем на логин
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
