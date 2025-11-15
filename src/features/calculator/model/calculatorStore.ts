import { create } from "zustand";
import { ICalculatorStoreSchema } from "./types";

export const calculatorStore = create<ICalculatorStoreSchema>((set) => ({
    calculatedCultures: {},
    setCalculatedCultures: (calculatedCultures) => set({calculatedCultures}),
    
    calculatedField: null,
    setCalculatedField: (calculatedField) => set({calculatedField}),

    selectedField: null,
    setSelectedField: (selectedField) => set({selectedField}),
    
    selectedCultures: null,
    setSelectedCultures: (selectedCultures) => set({selectedCultures}),

    areaField: 0,
    setAreaField: (areaField) => set({areaField})
}))