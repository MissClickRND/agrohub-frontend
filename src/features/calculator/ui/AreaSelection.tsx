import { Autocomplete, Input, Loader, Stack } from "@mantine/core";
import { useCalculator } from "../model/lib/hooks/useCalculator";
import { useState } from "react";

export const AreaSelection = () => {
  const { isLoading, cultures, areaFieldHandle } = useCalculator();
  const [area, setArea] = useState<number>();
  return (
    <Stack>
      <Input
        placeholder="Площадь поля"
        value={area}
        onChange={(e) => setArea(Number(e.target.value))}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <Autocomplete
          label="Культура"
          comboboxProps={{ withinPortal: false }}
          w={"100px"}
          onChange={(value) => {
            if (typeof area === "number") areaFieldHandle(area, value);
          }}
          data={cultures.map((cul) => String(cul.name))}
        />
      )}
    </Stack>
  );
};
