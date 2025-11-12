import apiClient from "../../../../app/api/axiosInstance";
import { API, endpoints } from "../../../../shared/configs/apiConfigs";
import { GroundData, IResponseDataGround } from "./types";

export const newGroundData = async (body: GroundData) => {
  const res = await apiClient.put(API + endpoints.NEW_DATA, {
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
    createdAt: body?.date?.toString().includes("Z")
      ? body?.date
      : `${body.date}T13:35:24.656Z`,
  });
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка создания данных почвы");
};

export const getGroundData = async (
  id: number
): Promise<IResponseDataGround> => {
  const res = await apiClient.get(API + endpoints.GET_DATA(id));
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка получения данных почвы");
  return res.data;
};
