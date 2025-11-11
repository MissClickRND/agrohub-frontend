import apiClient from "../../../app/api/axiosInstance";
import { API, endpoints } from "../../../shared/configs/apiConfigs";
import { Culture, GanttTask, ISetTask } from "./types";

export const getCulturesList = async (): Promise<Culture[]> => {
  const res = await apiClient.get(API + endpoints.CULTURES_LIST);
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка получения культур");
  return res.data;
};

export const getCultureLogs = async (id: number): Promise<GanttTask[]> => {
  const res = await apiClient.get(API + endpoints.GET_LOGS(id));
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка получения записей");
  return res.data;
};

export const newLog = async (body: ISetTask) => {
  const res = await apiClient.put(API + endpoints.NEW_LOG, {
    zoneId: body.parent,
    cultureId: body.text,
    createdAt: body.start,
    endAt: body.end,
  });
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка создания записи");
};

export const updateLog = async ({
  body,
  id,
}: {
  body: GanttTask;
  id: number;
}) => {
  const res = await apiClient.post(API + endpoints.UPDATE_LOG(id), {
    cultureId: body.text,
    createdAt: body.start,
    endAt: body.end,
  });
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка обновления записи");
};

export const deleteLog = async (id: number | null) => {
  const res = await apiClient.delete(API + endpoints.DELETE_LOG(id));
  if (res.status !== 200 && res.status !== 201)
    throw new Error("Ошибка удаления записи");
};
