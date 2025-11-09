import { Button, ColorPicker, Group, Modal, TextInput } from "@mantine/core";
import { useState, useEffect } from "react";

type Props = {
  opened: boolean;
  onCancel: () => void;
  onSubmit: (p: { name: string; color: string }) => void;
  defaultName?: string;
  defaultColor?: string;
};

export default function FieldModal({
  opened,
  onCancel,
  onSubmit,
  defaultName = "",
  defaultColor = "#3388ff",
}: Props) {
  const [name, setName] = useState(defaultName);
  const [color, setColor] = useState(defaultColor);

  useEffect(() => {
    if (opened) {
      setName(defaultName);
      setColor(defaultColor);
    }
  }, [opened, defaultName, defaultColor]);

  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      title="Новое поле"
      centered
      zIndex={9999}
    >
      <TextInput
        label="Название"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        autoFocus
      />
      <ColorPicker
        value={color}
        onChange={setColor}
        swatches={["#3388ff", "#ff5555", "#4caf50", "#ff9800", "#9c27b0"]}
        mt="md"
      />
      <Group mt="md">
        <Button
          onClick={() =>
            onSubmit({ name: name.trim() || "Без названия", color })
          }
        >
          Создать
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
      </Group>
    </Modal>
  );
}
