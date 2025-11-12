import apiClient from "../../../../../app/api/axiosInstance";
import { API, endpoints } from "../../../../../shared/configs/apiConfigs";
import { GroundData } from "../types";

export const newGroundData = async (body: GroundData) => {
  const res = await apiClient.put(API + endpoints.NEW_LOG, {
    N: body.N,
    P: body.P,
    K: body.K,
    Temperature: body.Temperature,
    Humidity: body.Humidity,
    RainFall: body.RainFall,
    pH: body.pH,
    location: {
      type: "Point",
      coordinates: body.coordinates,
    },
    createdAt: `${body.date}T13:35:24.656Z`,
  });
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка создания данных почвы");
};
