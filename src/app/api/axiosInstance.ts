import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API } from "../../shared/configs/apiConfigs";

const apiClient = axios.create({
  baseURL: API,
});

let isRefreshing = false;

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          window.location.href = "/auth/login";
          throw new Error("No refresh token");
        }

        const response = await axios.post(`${API}/api/auth/refresh`, {
          refreshToken: refreshToken,
        });

        const newAccessToken = response.data.access_token;
        localStorage.setItem("access_token", newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Очищаем токены при ошибке обновления
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
