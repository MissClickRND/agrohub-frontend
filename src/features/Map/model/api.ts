import { API, endpoints } from "../../../shared/configs/apiConfigs";
import apiClient from "../../../app/api/axiosInstance";
import { Field } from "./types";

export const newField = async (body: Field) => {
  const res = await apiClient.post(API + endpoints.NEW_FIELD, body);
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка создания поля");
};

export const getFields = async () => {
  const res = await apiClient.get(API + endpoints.GET_FIELDS);
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка получения полей");
  return res.data;
};
