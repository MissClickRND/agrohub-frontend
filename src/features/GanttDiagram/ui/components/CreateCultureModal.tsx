import { Button, Group, Modal, Select, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useGetCulture } from "../../model/lib/hooks/useGetCultures";
import { useGetZones } from "../../../Map/model/lib/hooks/useGetZones";

type CreateValues = {
  text: string;
  start: Date | null;
  end: Date | null;
  idParents: string;
};

export default function CreateCultureModal({
  opened,
  submitting,
  onClose,
  onSubmit,
  idField,
}: {
  idField: number | undefined;
  opened: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: {
    text: string;
    start: Date;
    end: Date;
    idParents: string;
  }) => Promise<void> | void;
}) {
  const { cultures } = useGetCulture();
  const { zones } = useGetZones(idField);
  const [parents, setParents] = useState<{ value: string; label: string }[]>(
    []
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (zones) {
      const transformedParents = zones.map((zone: any) => ({
        value: zone.id.toString(),
        label: zone.name || `Зона ${zone.id}`,
      }));
      setParents(transformedParents);
    }
  }, [zones]);

  const form = useForm<CreateValues>({
    mode: "uncontrolled",
    initialValues: { text: "", idParents: "", start: null, end: null },
    validate: {
      text: (v) => (v ? null : "Укажите название записи"),
      start: (v) => (v ? null : "Выберите дату начала"),
      idParents: (v) => (v.trim() ? null : "Выберите зону"),
      end: (v, values) => {
        if (!v) return "Выберите дату окончания";
        if (values.start && v < values.start)
          return "Дата окончания не может быть раньше начала";
        return null;
      },
    },
  });

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setSubmitError(null);
        onClose();
        form.reset();
      }}
      title="Создание записи культуры"
      centered
      size="lg"
    >
      <form
        onSubmit={form.onSubmit(async (vals) => {
          setSubmitError(null);
          try {
            await onSubmit({
              text: vals.text.trim(),
              start: vals.start!,
              end: vals.end!,
              idParents: vals.idParents!,
            });
            form.reset();
          } catch (e) {
            setSubmitError("Не удалось создать задачу. Повторите попытку.");
          }
        })}
      >
        <Select
          label="Название"
          placeholder="Например, Пшеница"
          key={form.key("text")}
          {...form.getInputProps("text")}
          data={cultures.map((culture) => ({
            value: String(culture.id),
            label: culture.name,
          }))}
          mb="md"
          required
        />

        <Select
          label="Зона"
          placeholder="Выберите зону поля"
          {...form.getInputProps("idParents")}
          data={parents}
          mb="md"
          required
        />

        <Group grow gap="md" mb="sm">
          <DatePickerInput
            placeholder="От"
            label="Дата начала"
            value={form.values.start}
            // @ts-ignore
            onChange={(v) => form.setFieldValue("start", v)}
            error={form.errors.start}
            required
            clearable
          />
          <DatePickerInput
            placeholder="До"
            label="Дата окончания"
            value={form.values.end}
            // @ts-ignore
            onChange={(v) => form.setFieldValue("end", v)}
            error={form.errors.end}
            required
            clearable
          />
        </Group>

        {submitError && (
          <Text c="red" fz="sm" mb="sm">
            {submitError}
          </Text>
        )}

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} type="button">
            Отмена
          </Button>
          <Button loading={submitting} type="submit">
            Создать
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
