import { Box, Text, Flex, Button } from "@mantine/core";
import { useRef } from "react";
import {
  AgroHubMap,
  AgroHubMapHandle,
} from "../../../features/Map/ui/AgroHubMap";
import { Field } from "../../../features/Map/model/types";
import { IconPlus } from "@tabler/icons-react";

export default function FieldViewer({
  data,
  isDrawing,
  onDrawingComplete,
  onCancelDrawing,
  selectedFieldId,
}: {
  data: Field[];
  isDrawing: boolean;
  onDrawingComplete: (field: Field) => void;
  onCancelDrawing: () => void;
  selectedFieldId: number | undefined;
}) {
  const mapRef = useRef<AgroHubMapHandle>(null);

  return (
    <Box h={"100%"}>
      <Box h={"100%"} bdrs={8} w="100%">
        {selectedFieldId && (
          <Flex align="center" justify="space-between" p={16}>
            <Box>
              <Text fw={500} fz={18}>
                Поле: Центральное
              </Text>
              <Text fw={400} c="var(--subtitle)" fz={12}>
                Центральная поле ростовской области
              </Text>
            </Box>

            <Button color="primary.4" radius="8px" align={"center"}>
              <Box mr={8}>
                <IconPlus />
              </Box>
              Добавить зону
            </Button>
          </Flex>
        )}

        {!selectedFieldId && (
          <Flex mah={78.5} align="center" justify="space-between" p={16}>
            <Box>
              <Text fw={500} fz={18}>
                Выберите поле
              </Text>
              <Text fw={400} c="var(--subtitle)" fz={12}>
                Выберите поле что бы посмотреть информацию о нем
              </Text>
            </Box>
          </Flex>
        )}

        <Flex flex={1} h={"calc(100% - 78.5px)"} gap={20}>
          <Box h={"100%"} w={selectedFieldId ? "80%" : "100%"}>
            <AgroHubMap
              ref={mapRef}
              data={data}
              isDrawing={isDrawing}
              onDrawingComplete={onDrawingComplete}
              onCancelDrawing={onCancelDrawing}
              selectedFieldId={selectedFieldId}
            />
          </Box>
          {selectedFieldId && (
            <Box
              style={{
                borderRadius: "8px 0px 8px 0px",
                borderBottom: "0",
                borderRight: "0",
              }}
              w="20%"
              bd={"1px solid var(--white-gray)"}
            >
              <Text
                fw={500}
                fz={18}
                p={16}
                style={{ borderBottom: "1px solid var(--white-gray)" }}
              >
                Зоны поля
              </Text>
            </Box>
          )}
        </Flex>
      </Box>
    </Box>
  );
}
