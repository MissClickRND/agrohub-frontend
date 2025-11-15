import { Culture } from "../../GanttDiagram/model/types";
import { Field } from "../../Map/model/types";

export interface ICalculateReq {
    area: number,
    cultureId: number,
}

export interface ICalculateRes {
    crop: string,
    area_ha: number,
    yield_t: number,
    revenue_rub: number,
    costs: {
        seeds_rub: number,
        fertilizers_rub: number,
        nitrogen_rub: number,
        phosphorus_rub: number,
        potassium_rub: number,
        total_rub: number,
    },
    profit_rub: number,
    profit_per_ha_rub: number    
}

export interface ICalculatorStoreSchema {
    calculatedCultures: Record<number | string, Culture>,
    setCalculatedCultures: (calculatedCultures: Record<number | string, Culture>) => void,

    calculatedField: Field | null,
    setCalculatedField: (calculatedField: Field | null) => void

    selectedField: Field | null,
    setSelectedField: (selectedField: Field | null) => void,
    
    selectedCultures: Record<number | string, Culture> | null,
    setSelectedCultures: (selectedCutlures: Record<number | string, Culture> | null) => void

    areaField: number,
    setAreaField: (areaField: number) => void
}
