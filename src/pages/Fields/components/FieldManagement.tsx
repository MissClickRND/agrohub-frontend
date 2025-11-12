import {
  Box,
  Button,
  Loader,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import FieldTemplate from "./FieldTemplate";
import { Field } from "../../../features/Map/model/types";
import { IconPlus, IconX } from "@tabler/icons-react";

export default function FieldManagement({
  data,
  isLoading,
  selectedFieldId,
  onFieldSelect,
  isFieldDrawing,
  onToggleFieldDrawing,
}: {
  data: Field[];
  isLoading: boolean;
  selectedFieldId?: number;
  onFieldSelect: (id?: number) => void;
  isFieldDrawing: boolean;
  onToggleFieldDrawing: () => void;
}) {
  return (
    <Box p={12} pb={0} w={280}>
      <Text fw={600} mb={8}>
        Поля
      </Text>
      <Button
        fullWidth
        mb={8}
        onClick={onToggleFieldDrawing}
        color={isFieldDrawing ? "red" : "primary.7"}
        radius={8}
      >
        {isFieldDrawing ? <IconX /> : <IconPlus />}
        {isFieldDrawing ? "Отменить" : "Создать поле"}
      </Button>
      <ScrollArea scrollbarSize={6} h="85vh">
        <Stack gap={8} pos="relative">
          {isLoading && (
            <LoadingOverlay visible>
              <Loader />
            </LoadingOverlay>
          )}
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
      </ScrollArea>
    </Box>
  );
}
