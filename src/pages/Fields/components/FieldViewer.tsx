import {
  Box,
  Button,
  Flex,
  Text,
  ScrollArea,
  Stack,
  Badge,
} from "@mantine/core";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Field, Zone } from "../../../features/Map/model/types";
import {
  AgroHubMap,
  AgroHubMapHandle,
} from "../../../features/Map/ui/AgroHubMap";
import { useGetZones } from "../../../features/Map/model/lib/hooks/useGetZones";

export type FieldViewerHandle = {
  startFieldDrawing: () => void;
  startZoneDrawing: () => void;
};

const FieldViewer = forwardRef<
  FieldViewerHandle,
  {
    fields: Field[];
    selectedFieldId?: number;
  }
>(({ fields, selectedFieldId }, ref) => {
  const mapRef = useRef<AgroHubMapHandle>(null);
  const { zones } = useGetZones(selectedFieldId);
  const selectedField = fields.find((f) => f.id === selectedFieldId);

  useImperativeHandle(
    ref,
    () => ({
      startFieldDrawing: () => mapRef.current?.startFieldDrawing(),
      startZoneDrawing: () => mapRef.current?.startZoneDrawing(),
    }),
    []
  );

  return (
    <Box h="100%">
      <Box h="100%" bdrs={8} w="100%">
        {selectedField ? (
          <Flex align="center" justify="space-between" p={16}>
            <Box>
              <Text fw={500} fz={18}>
                Поле: {selectedField.name}
              </Text>
              <Text fw={400} c="var(--subtitle)" fz={12}>
                Зон: {zones.length}
              </Text>
            </Box>
            <Button
              color="primary.4"
              radius="8px"
              onClick={() => mapRef.current?.startZoneDrawing()}
            >
              Добавить зону
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

        <Flex flex={1} h={"calc(100% - 78.5px)"} gap={20}>
          <Box h={"100%"} w={selectedFieldId ? "80%" : "100%"}>
            <AgroHubMap
              ref={mapRef}
              fields={fields}
              zones={zones}
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
              <ScrollArea h={"calc(100% - 58px)"} p={12}>
                <Stack gap={8}>
                  {zones.length === 0 && (
                    <Text c="dimmed" px={4}>
                      Зон пока нет. Нажмите «Добавить зону».
                    </Text>
                  )}
                  {zones.map((z: Zone) => (
                    <Box
                      key={z.id ?? z.name}
                      p={10}
                      bd={"1px solid var(--white-gray)"}
                      bdrs={8}
                    >
                      <Text fw={600}>
                        <span
                          style={{
                            display: "inline-block",
                            width: 10,
                            height: 10,
                            borderRadius: 2,
                            background: z.color,
                            marginRight: 8,
                          }}
                        />
                        {z.name}
                      </Text>
                      <Badge mt={6} variant="light">
                        Площадь: {z.area ?? "—"}
                      </Badge>
                    </Box>
                  ))}
                </Stack>
              </ScrollArea>
            </Box>
          )}
        </Flex>
      </Box>
    </Box>
  );
});

FieldViewer.displayName = "FieldViewer";
export default FieldViewer;
