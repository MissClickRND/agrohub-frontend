import apiClient from "../../../app/api/axiosInstance"
import { endpoints } from "../../../shared/configs/apiConfigs"
import { ICalculateReq, ICalculateRes } from "./types"

export const calculate = async (body: ICalculateReq) => {
    const res = await apiClient.post<ICalculateRes>(endpoints.CALCULATE, body)
    if (res.status !== 200 && res.status !== 201) throw new Error("Ошибка при расчётах")
    return res.data
}