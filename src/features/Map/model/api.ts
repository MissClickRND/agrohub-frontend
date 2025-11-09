import { API, endpoints } from "../../../shared/configs/apiConfigs";
import apiClient from "../../../app/api/axiosInstance";
import { Field, Zone } from "./types";

export const newField = async (body: Field) => {
  const res = await apiClient.put(API + endpoints.NEW_FIELD, {
    name: body.name,
    color: body.color,
    geometry: {
      type: "Polygon",
      coordinates: body.geometry.coordinates,
    },
  });
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка создания поля");
};

export const getFields = async () => {
  const res = await apiClient.get(API + endpoints.GET_FIELDS);
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка получения полей");
  return res.data;
};

export const deleteField = async (id: number | undefined) => {
  const res = await apiClient.delete(API + endpoints.DELETE_FIELD + `/${id}`);
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка удаления поля");
};

export const newZone = async ({
  body,
  id,
}: {
  body: Zone;
  id: number | undefined;
}) => {
  const res = await apiClient.put(API + endpoints.NEW_ZONE + `${id}/create`, {
    name: body.name,
    color: body.color,
    geometry: {
      type: "Polygon",
      coordinates: body.geometry.coordinates,
    },
  });
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка создания зоны");
};

export const getZones = async (id: number) => {
  const res = await apiClient.get(
    API + endpoints.GET_ZONES + `${id}/zones/list`
  );
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка получения зон поля");
  return res.data;
};
