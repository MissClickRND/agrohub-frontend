import {
  Box,
  Button,
  Center,
  NumberInput,
  Stack,
  ScrollArea,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useSetNewGroundData } from "../model/lib/hooks/useSetNewGroundData";

export default function SetGroundInfoForm({
  coordinates,
  close,
}: {
  close: () => void;
  coordinates: number[] | null;
}) {
  const { newGroundData } = useSetNewGroundData();
  const form = useForm({
    initialValues: {
      N: null,
      P: null,
      K: null,
      Temperature: null,
      Humidity: null,
      RainFall: null,
      pH: null,
      coordinates: coordinates,
      date: new Date().toISOString(),
    },
    validate: {
      N: (value) => (value ? null : "Поле обязательно для заполнения"),
      P: (value) => (value ? null : "Поле обязательно для заполнения"),
      K: (value) => (value ? null : "Поле обязательно для заполнения"),
      pH: (value) => (value ? null : "Поле обязательно для заполнения"),
      Humidity: (value) => (value ? null : "Поле обязательно для заполнения"),
      Temperature: (value) =>
        value ? null : "Поле обязательно для заполнения",
      RainFall: (value) => (value ? null : "Поле обязательно для заполнения"),
      coordinates: (value) =>
        value?.length ? null : "Поле обязательно для заполнения",
    },
  });

  useEffect(() => {
    form.setFieldValue("coordinates", coordinates);
  }, [coordinates]);

  const handleSubmit = () => {
    newGroundData(form.values);
    close();
    form.reset();
  };

  return (
    <Box w="100%" h="100%">
      <ScrollArea h="100%" type="always">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack p={16} gap={8}>
            <NumberInput
              label="Азот (мг/кг)"
              placeholder="Введите показатели азота"
              {...form.getInputProps("N")}
              min={0}
            />
            <NumberInput
              label="Фосфор (мг/кг)"
              placeholder="Введите показатели фосфора"
              {...form.getInputProps("P")}
              min={0}
            />
            <NumberInput
              label="Калий (мг/кг)"
              placeholder="Введите показатели калия"
              {...form.getInputProps("K")}
              min={0}
            />
            <NumberInput
              label="Кислотность почвы"
              placeholder="Введите показатели кислотности"
              {...form.getInputProps("pH")}
              min={0}
              max={14}
              step={0.1}
            />
            <NumberInput
              label="Влажность (%)"
              placeholder="Введите показатели влажности"
              {...form.getInputProps("Humidity")}
              min={0}
              max={100}
            />
            <NumberInput
              label="Температура (℃)"
              placeholder="Введите показатели температуры"
              {...form.getInputProps("Temperature")}
              min={-50}
              max={60}
            />
            <NumberInput
              label="Осадки (мм)"
              placeholder="Введите показатель осадков"
              {...form.getInputProps("RainFall")}
              min={0}
            />
            <DatePickerInput
              label="Дата"
              placeholder="Выберите дату измерения"
              {...form.getInputProps("date")}
            />
            <Center>
              <Button
                type="submit"
                color="primary.7"
                disabled={!coordinates}
                fullWidth
                size="md"
              >
                Ввести данные
              </Button>
            </Center>
          </Stack>
        </form>
      </ScrollArea>
    </Box>
  );
}
