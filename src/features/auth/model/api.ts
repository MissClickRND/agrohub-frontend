import axios from "axios";
import { API, endpoints } from "../../../shared/configs/apiConfigs";
import apiClient from "../../../app/api/axiosInstance";
import { ILoginRequest, IRegisterRequest } from "./types";

export const login = async (body: ILoginRequest) => {
  const res = await axios.post(API + endpoints.LOGIN, body);
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка авторизации");
  return res.data;
};

export const register = async (body: IRegisterRequest) => {
  const res = await axios.post(API + endpoints.REGISTER, body);
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка регистрации");
};

export const logout = async () => {
  const res = await apiClient.post(API + endpoints.LOGOUT);
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка выхода");
};

export const userInfo = async () => {
  const res = await apiClient.get(API + endpoints.USER_INFO);
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка проверки пользователя");
  return res.data;
};
