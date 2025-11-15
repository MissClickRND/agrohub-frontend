import { useState } from "react";
import { useGetCulture } from "../../../../GanttDiagram/model/lib/hooks/useGetCultures";
import { useGetFields } from "../../../../Map/model/lib/hooks/useGetFields";
import { Field, Zone } from "../../../../Map/model/types";
import { useNotifications } from "../../../../../shared/lib/hooks/useNotifications";
import { calculatorStore } from "../../calculatorStore";

export const useCalculator = () => {
  const {showError} = useNotifications()
  const { fields } = useGetFields();
  const { cultures, isLoading } = useGetCulture();
  const [selectedZone, setSelectedZone] = useState<Zone | Field | null>(null);
  const {selectedCultures, selectedField, setSelectedField, areaField, setAreaField, setSelectedCultures, setCalculatedCultures, calculatedCultures, calculatedField, setCalculatedField} = calculatorStore()

  const fieldChangeHandler = (value: string) => {
    const newField = fields?.find((field) => field.name === value);
    setSelectedField(newField ?? null);
    setSelectedZone(null);
    setSelectedCultures(null);
  };

  const setCultureHandler = (value: string, type: string = 'main') => {
    const culture = cultures.find((cul) => cul.name === value);
    if (culture) {
      setSelectedCultures({
        ...selectedCultures,
        [type]: culture,
      });
    }
  };

  const handleCalculate = () => {
    if (selectedCultures) {
        setCalculatedField(selectedField)
        setCalculatedCultures(selectedCultures)
    } else {
        showError("Нечего расчитывать, сначала заполните форму слева")
    }
  }
  
  const areaFieldHandle = (area: number, name: string) => {
    const culture = cultures.find((cul) => cul.name === name)
    if (culture) {
      setAreaField(area)
      setSelectedCultures({
        area: culture
      })
    }
  }

  const resetSelected = () => {
    setSelectedCultures(null)
  }


  return {
    calculatedField,
    areaFieldHandle,
    fields,
    cultures,
    isLoading,
    selectedField,
    selectedZone,
    selectedCultures,
    fieldChangeHandler,
    setCultureHandler,
    setSelectedZone,
    handleCalculate,
    calculatedCultures,
    areaField,
    resetSelected
  };
};
