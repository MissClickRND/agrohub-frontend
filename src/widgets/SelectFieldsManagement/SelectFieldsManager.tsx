import {
  Box,
  Loader,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";

import SelectFieldTemplate from "./component/SelectFieldTemplate";
import { Field } from "../../features/Map/model/types";

export default function SelectFieldsManager({
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
    <Box
      p={12}
      pb={0}
      miw="280px"
      style={{ borderRight: "1px solid var(--white-gray)" }}
    >
      <Text fw={500} fz={18} mb={8}>
        Поля
      </Text>
      <ScrollArea scrollbarSize={6}>
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
            <SelectFieldTemplate
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
