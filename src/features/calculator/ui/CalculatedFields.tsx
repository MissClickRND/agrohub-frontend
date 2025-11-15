import { Accordion, Button, Group, Stack, Text } from "@mantine/core";
import { useCalculator } from "../model/lib/hooks/useCalculator";
import { CalculatedField } from "./CalculatedField";

export const CalculatedFields = () => {
  const { handleCalculate, calculatedCultures, calculatedField, areaField } =
    useCalculator();
    console.log(calculatedField)
  return (
    <Stack>
      <Group justify="space-between">
        <Text fz={"h3"}>Расчёты</Text>
        <Button onClick={handleCalculate}>Расчитать</Button>
      </Group>

      <Accordion>
        {calculatedCultures &&
          calculatedField &&
          Object.keys(calculatedCultures).map((key) => (
            <CalculatedField
              key={key}
              cultureId={calculatedCultures[key]!.id}
              title={
                key === "main"
                  ? "Основное поле"
                  : key === "area"
                  ? "Ваше поле"
                  : "Зона № " + key
              }
              area={
                key === "area"
                  ? areaField * 10000
                  : key === "main"
                  ? calculatedField!.area!
                  : calculatedField!.zones!.find(
                      (zone) => zone.id === Number(key)
                    )!.area!
              }
            />
          ))}
      </Accordion>
    </Stack>
  );
};
