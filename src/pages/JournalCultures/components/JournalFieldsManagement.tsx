import {
  Box,
  Loader,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";

import { Field } from "../../../features/Map/model/types";

import JournalFieldTemplate from "./JournalFieldTemplate";

export default function JournalFieldsManagement({
  data,
  isLoading,
  selectedFieldId,
  onFieldSelect,
}: {
  data: Field[];
  isLoading: boolean;
  selectedFieldId?: number;
  onFieldSelect: (id?: number) => void;
}) {
  return (
    <Box p={12} pb={0} w="17%">
      <Text fw={500} fz={18} mb={8}>
        Поля
      </Text>
      <ScrollArea scrollbarSize={6} h="85vh">
        <Stack gap={8} pos="relative">
          {isLoading && (
            <LoadingOverlay visible>
              <Loader />
            </LoadingOverlay>
          )}
          {!isLoading && data.length === 0 && (
            <Text c="dimmed" ta="center">
              Нет полей
            </Text>
          )}

          {data.map((f) => (
            <JournalFieldTemplate
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
