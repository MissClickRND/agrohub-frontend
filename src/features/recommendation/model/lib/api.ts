import apiClient from "../../../../app/api/axiosInstance";
import { API, endpoints } from "../../../../shared/configs/apiConfigs";
import { IRecommendationRequest } from "./type";

export const recommendation = async (body: IRecommendationRequest) => {
  const res = await apiClient.post(API + endpoints.RECOMMENDATION, {
    duration_months: body.duration_months,
    N: body.N,
    P: body.P,
    K: body.K,
    temperature: body.temperature,
    humidity: body.humidity,
    ph: body.ph,
    rainfall: body.rainfall,
    last_crop_duration: body.last_crop_duration,
    last_crop: body.last_crop,
  });
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка получений рекомендаций");
};
