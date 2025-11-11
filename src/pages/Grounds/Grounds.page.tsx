import { IconMap } from "@tabler/icons-react";
import GroundsTable from "./components/GroundsTable.tsx";
import { Box, Button, Flex, Stack, Text } from "@mantine/core";

const GroundsPage = () => {
  return (
    <Stack>
      <Flex
        style={{ borderBottom: "1px solid var(--white-gray)" }}
        mah={78.5}
        align="center"
        justify="space-between"
        p={16}
      >
        <Box>
          <Text fw={500} fz={18}>
            Состав почв
          </Text>
          <Text fw={400} c="var(--subtitle)" fz={12}>
            Здесь вы видете последние изменения почв
          </Text>
        </Box>

        <Button>
          <IconMap />
          Внести данные
        </Button>
      </Flex>
      <GroundsTable />
    </Stack>
  );
};

export default GroundsPage;
