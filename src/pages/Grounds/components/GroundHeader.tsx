import { Box, Text, Flex, Button, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconMap } from "@tabler/icons-react";

export default function GroundHeader({ open }: { open: any }) {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  return (
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
          Здесь вы видите последние сведения о почве
        </Text>
      </Box>

      <Button color="var(--main-color)" onClick={() => open()}>
        <IconMap />
        {isMobile ? null : "Внести данные"}
      </Button>
    </Flex>
  );
}
