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
import { IconPlus } from "@tabler/icons-react";
import styles from "../classes/FieldManagement.module.css";

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
    <Box p={12} pb={0} w={280}>
      <Button
        fullWidth
        mb={12}
        onClick={onAddField}
        color="primary.4"
        radius={8}
      >
        <IconPlus />
        Добавить поле
      </Button>

      <Text fw={600} mb={8}>
        Поля
      </Text>
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
