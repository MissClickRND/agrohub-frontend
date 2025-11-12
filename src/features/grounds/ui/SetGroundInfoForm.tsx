import { Box, Button, Center, NumberInput, Stack } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useSetNewGroundData } from "../model/lib/hooks/useSetNewGroundData";

export default function SetGroundInfoForm({
  coordinates,
}: {
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
      date: new Date(),
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
  };

  return (
    <Box w="30vw" h="100%">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack p={16} pt={0} gap={8}>
          <NumberInput
            label="Азот (мг/кг)"
            placeholder="Введите показатели азота"
            {...form.getInputProps("N")}
          />
          <NumberInput
            label="Фосфор (мг/кг)"
            placeholder="Введите показатели фосфора"
            {...form.getInputProps("P")}
          />
          <NumberInput
            label="Калий (мг/кг)"
            placeholder="Введите показатели калия"
            {...form.getInputProps("K")}
          />
          <NumberInput
            label="Кислотность почвы"
            placeholder="Введите показатели кислотности"
            {...form.getInputProps("pH")}
          />
          <NumberInput
            label="Влажность (%)"
            placeholder="Введите показатели влажности"
            {...form.getInputProps("Humidity")}
          />
          <NumberInput
            label="Температура (℃)"
            placeholder="Введите показатели температуры"
            {...form.getInputProps("Temperature")}
          />
          <NumberInput
            label="Осадки (мм)"
            placeholder="Введите показатель осадков"
            {...form.getInputProps("RainFall")}
          />
          <DatePickerInput
            label="Дата"
            placeholder="Выберите дату измерения"
            {...form.getInputProps("date")}
          />
          <Center>
            <Button type="submit" color="primary.7">
              Ввести данные
            </Button>
          </Center>
        </Stack>
      </form>
    </Box>
  );
}
