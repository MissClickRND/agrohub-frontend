export const API = "https://agrohub.miss-click.ru";
// export const API = "http://158.160.24.86:4000";

export const endpoints = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  USER_INFO: "/api/gate/me/profile",
  CHECK_ORGANIZATION: "/api/organization/my",
  CREATE_ORGANIZATION: "/api/organization/create",

  // поля
  GET_FIELDS: "/api/fields/list",
  NEW_FIELD: "/api/fields/create",
  DELETE_FIELD: (id: number | undefined) => `/api/fields/delete/${id}`,

  // зоны поля
  NEW_ZONE: (id: number | undefined) => `/api/fields/${id}/create`,
  GET_ZONES: (id: number) => `/api/fields/${id}/zones/list`,
  DELETE_ZONE: (id: number | undefined) => `/api/fields/zone/delete/${id}`,

  // записи в зонах поля
  GET_LOGS: (id: number) => `/api/culture/${id}/list`,
  NEW_LOG: "/api/culture/create",
  UPDATE_LOG: (id: number) => `/api/culture/update/${id}`,
  DELETE_LOG: (id: number | null) => `/api/culture/delete/${id}`,
  CULTURES_LIST: "/api/culture/list",

  // данные о почве
  NEW_DATA: "/api/ground/create",
  GET_DATA: (id: number) => `/api/ground/${id}/list`,
  DELETE_DATA: (id: number | null) => `/api/ground/${id}/delete`,

  // дашборды
  GET_DASHBOARD: "/api/dashboard/get",
  GET_NPK_DASHBOARD: (id: number) => `/api/dashboard/NPK/${id}`,

  // чат
  SEND_MESSAGE: "/api/chat/completion",
  SEND_MESSAGE_STREAM: "/api/chat/completion-stream",

  // рекомендации
  RECOMMENDATION: "/api/recommendation/predict",
};
