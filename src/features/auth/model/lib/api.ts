import axios from "axios";
import { ILoginRequest, IRegisterRequest } from "./types";

import { API, endpoints } from "../../../../shared/configs/apiConfigs";
import apiClient from "../../../../app/api/axiosInstance";

export const login = async (body: ILoginRequest) => {
  const res = await axios.post(API + endpoints.LOGIN, body, {
    withCredentials: true,
    headers: { "x-client-type": "Web" },
  });
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка авторизации");
};

export const register = async (body: IRegisterRequest) => {
  const res = await axios.post(API + endpoints.REGISTER, body, {
    withCredentials: true,
    headers: { "x-client-type": "Web" },
  });
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка регистрации");
};

export const logout = async () => {
  const res = await apiClient.post(API + endpoints.LOGOUT);
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка выхода");
};
