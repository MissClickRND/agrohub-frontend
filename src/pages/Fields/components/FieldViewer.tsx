import { Box, Text, Flex } from "@mantine/core";
import { useRef } from "react";
import {
  AgroHubMap,
  AgroHubMapHandle,
} from "../../../features/Map/ui/AgroHubMap";
import { Field } from "../../../features/Map/model/types";

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
    <Box w="100vw">
      <Box bdrs={8} bd={"1px solid var(--white-gray)"} w="100%">
        <Flex align="center" justify="space-between" p={16}>
          <Box>
            <Text fw={500} fz={18}>
              Поле: Центральное
            </Text>
            <Text fw={400} c="var(--subtitle)" fz={12}>
              Центральная поле ростовской области
            </Text>
          </Box>
        </Flex>

        <Flex gap={20}>
          <Box h="75vh" w="80%">
            <AgroHubMap
              ref={mapRef}
              data={data}
              isDrawing={isDrawing}
              onDrawingComplete={onDrawingComplete}
              onCancelDrawing={onCancelDrawing}
              selectedFieldId={selectedFieldId}
            />
          </Box>
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
        </Flex>
      </Box>
    </Box>
  );
}
