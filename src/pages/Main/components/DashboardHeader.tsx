import { Flex, Box, Text } from "@mantine/core";

export default function DashboardHeader() {
  return (
    <Flex
      align="center"
      justify="space-between"
      p={16}
      style={{ borderBottom: "1px solid var(--white-gray)" }}
    >
      <Box>
        <Text fw={500} fz={18}>
          Дашборды
        </Text>
        <Text fw={400} c="var(--subtitle)" fz={12}>
          Удобная статистика отраженная в графиках
        </Text>
      </Box>
    </Flex>
  );
}
