import { Box, Button, Flex, Text, ScrollArea, Stack, em } from "@mantine/core";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Field, Zone } from "../../../features/Map/model/types";
import {
  AgroHubMap,
  AgroHubMapHandle,
} from "../../../features/Map/ui/AgroHubMap";
import { useGetZones } from "../../../features/Map/model/lib/hooks/useGetZones";
import { IconPlus, IconX } from "@tabler/icons-react";
import ZoneTemplate from "./ZoneTemplate";
import { useMediaQuery } from "@mantine/hooks";

export type FieldViewerHandle = {
  startFieldDrawing: () => void;
  startZoneDrawing: () => void;
  cancelDrawing: () => void;
};

const FieldViewer = forwardRef<
  FieldViewerHandle,
  {
    fields: Field[];
    selectedFieldId?: number;
    isZoneDrawing: boolean;
    onToggleZoneDrawing: () => void;
    onMapModeChange: (m: "idle" | "field" | "zone") => void;
  }
>(
  (
    {
      fields,
      selectedFieldId,
      isZoneDrawing,
      onToggleZoneDrawing,
      onMapModeChange,
    },
    ref
  ) => {
    const mapRef = useRef<AgroHubMapHandle>(null);
    const { zones } = useGetZones(selectedFieldId);
    const selectedField = fields.find((f) => f.id === selectedFieldId);
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

    useImperativeHandle(
      ref,
      () => ({
        startFieldDrawing: () => mapRef.current?.startFieldDrawing(),
        startZoneDrawing: () => mapRef.current?.startZoneDrawing(),
        cancelDrawing: () => mapRef.current?.cancelDrawing(),
      }),
      []
    );

    return (
      <Box h="100%">
        <Box h="100%" bdrs={8} w="100%">
          {selectedField ? (
            <Flex
              align="center"
              justify="space-between"
              p={16}
              wrap="wrap"
              gap="md"
            >
              <Box>
                <Text fw={500} fz={18}>
                  Поле: {selectedField.name}
                </Text>
                <Text fw={400} c="var(--subtitle)" fz={12}>
                  Зон: {zones.length}
                </Text>
              </Box>
              <Button
                color={isZoneDrawing ? "red" : "primary.7"}
                radius="8px"
                onClick={onToggleZoneDrawing}
              >
                {isZoneDrawing ? <IconX /> : <IconPlus />}
                {isZoneDrawing ? "Отменить" : "Создать зону"}
              </Button>
            </Flex>
          ) : (
            <Flex mah={78.5} align="center" justify="space-between" p={16}>
              <Box>
                <Text fw={500} fz={18}>
                  Выберите поле
                </Text>
                <Text fw={400} c="var(--subtitle)" fz={12}>
                  Нажмите на поле слева, чтобы увидеть его зоны
                </Text>
              </Box>
            </Flex>
          )}

          <Flex
            h="100%"
            flex={1}
            gap={20}
            direction={{ base: "column", lg: "row" }}
          >
            <Box
              h={isMobile ? "460px" : "100%"}
              w={{ base: "100%", lg: selectedFieldId ? "80%" : "100%" }}
            >
              <AgroHubMap
                ref={mapRef}
                fields={fields}
                zones={zones}
                selectedFieldId={selectedFieldId}
                onModeChange={onMapModeChange}
              />
            </Box>

            {selectedFieldId && (
              <Box
                style={{
                  borderRadius: "8px",
                }}
                w={{ base: "100%", lg: "20%" }}
                h={{ base: 300, lg: "100%" }}
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
                <ScrollArea
                  h={"calc(100% - 60px)"}
                  style={{ overflow: "hidden" }}
                  p={12}
                >
                  <Stack gap={8}>
                    {zones.length === 0 && (
                      <Text c="dimmed" px={4}>
                        Зон пока нет. Нажмите «Создать зону».
                      </Text>
                    )}
                    {zones.map((z: Zone) => (
                      <ZoneTemplate key={z.id ?? z.name} data={z} />
                    ))}
                  </Stack>
                </ScrollArea>
              </Box>
            )}
          </Flex>
        </Box>
      </Box>
    );
  }
);

FieldViewer.displayName = "FieldViewer";
export default FieldViewer;
