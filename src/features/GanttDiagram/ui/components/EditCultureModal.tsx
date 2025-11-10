import { Button, Group, Modal, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

type EditValues = {
  text: string;
  start: Date | null;
  end: Date | null;
};

export default function EditCultureModal({
  opened,
  submitting,
  onClose,
  onSubmit,
  initial,
}: {
  opened: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: {
    text: string;
    start: Date;
    end: Date;
  }) => Promise<void> | void;
  initial: { text: string; start: Date | null; end: Date | null };
}) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<EditValues>({
    mode: "uncontrolled",
    initialValues: {
      text: initial.text,
      start: initial.start,
      end: initial.end,
    },
    validate: {
      text: (v) => (v.trim() ? null : "Укажите название задачи"),
      start: (v) => (v ? null : "Выберите дату начала"),
      end: (v, values) => {
        if (!v) return "Выберите дату окончания";
        if (values.start && v < values.start)
          return "Дата окончания не может быть раньше начала";
        return null;
      },
    },
  });

  // переинициализация при смене выбранной задачи
  useEffect(() => {
    form.setValues({
      text: initial.text,
      start: initial.start,
      end: initial.end,
    });
    form.resetDirty();
    setSubmitError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initial.text,
    initial.start?.getTime?.(),
    initial.end?.getTime?.(),
    opened,
  ]);

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setSubmitError(null);
        onClose();
      }}
      title="Редактирование задачи"
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
            });
          } catch (e) {
            setSubmitError("Не удалось сохранить изменения. Попробуйте снова.");
          }
        })}
      >
        <TextInput
          label="Название"
          placeholder="Введите название"
          key={form.key("text")}
          {...form.getInputProps("text")}
          mb="md"
          required
        />

        <Group grow gap="md" mb="sm">
          <DatePickerInput
            label="Дата начала"
            value={form.values.start}
            onChange={(v) => form.setFieldValue("start", v)}
            error={form.errors.start}
            required
            clearable
          />
          <DatePickerInput
            label="Дата окончания"
            value={form.values.end}
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
            Сохранить
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
