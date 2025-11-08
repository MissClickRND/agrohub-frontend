import { Box, Text, Flex, Button } from "@mantine/core";
import { AgroHubMap } from "../../../features/Map/ui/AgroHubMap";
import { IconPlus } from "@tabler/icons-react";
import { Field } from "../../../features/Map/model/types";

export default function FieldViewer({ data }: { data: Field[] }) {
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

          <Button color="var(--main-color)">
            <Flex>
              <IconPlus /> <Text>Добавить зону</Text>
            </Flex>
          </Button>
        </Flex>

        <Flex gap={20}>
          <Box h="75vh" w="80%">
            <AgroHubMap data={data} />
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
