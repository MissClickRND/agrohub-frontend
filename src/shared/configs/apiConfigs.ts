export const API = "http://26.118.155.2:4000";

export const endpoints = {
  LOGIN: "/api/auth/login",
  USER_INFO: "/gate/me/profile",
  // REGISTER: "/register",

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
};
