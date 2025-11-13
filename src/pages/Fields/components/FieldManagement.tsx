import {
  Box,
  Button,
  em,
  Loader,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import FieldTemplate from "./FieldTemplate";
import { Field } from "../../../features/Map/model/types";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

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
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  return (
    <Box
      p={12}
      pb={0}
      w={{ base: "100%", sm: 280 }}
      h="100%" // Измените на 100% вместо 100vh
      style={{ display: "flex", flexDirection: "column" }} // Добавьте flex layout
    >
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

      {/* ScrollArea займет оставшееся пространство */}
      <Box style={{ flex: 1, minHeight: 0 }}>
        <ScrollArea scrollbarSize={6} h={isMobile ? "200px" : "100%"}>
          <Stack gap={8} pos="relative">
            {isLoading && (
              <LoadingOverlay visible>
                <Loader />
              </LoadingOverlay>
            )}
            {!isLoading && data.length === 0 && (
              <Text c="dimmed">Нет полей</Text>
            )}

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
    </Box>
  );
}
