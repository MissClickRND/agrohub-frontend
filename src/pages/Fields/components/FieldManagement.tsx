import { Box, Button, Stack, Text } from "@mantine/core";
import FieldTemplate from "./FieldTemplate";
import { Field } from "../../../features/Map/model/types";

export default function FieldManagement({
  data,
  isLoading,
  selectedFieldId,
  onFieldSelect,
  onAddField,
}: {
  data: Field[];
  isLoading: boolean;
  selectedFieldId?: number;
  onFieldSelect: (id?: number) => void;
  onAddField: () => void;
}) {
  return (
    <Box p={12} w={280}>
      <Button fullWidth mb={12} onClick={onAddField}>
        Добавить поле
      </Button>

      <Text fw={600} mb={8}>
        Поля
      </Text>
      <Stack gap={8}>
        {isLoading && <Text c="dimmed">Загрузка…</Text>}
        {!isLoading && data.length === 0 && <Text c="dimmed">Нет полей</Text>}

        {data.map((f) => (
          <FieldTemplate
            key={f.id ?? f.name}
            data={f}
            isSelected={selectedFieldId === f.id}
            onSelect={() => onFieldSelect(f.id)}
          />
        ))}
      </Stack>
    </Box>
  );
}
