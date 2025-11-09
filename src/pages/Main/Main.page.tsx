import { Box, Text } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";

export default function Main() {
  return (
    <Box w="100%" bg="blue">
      <Text py={50} ta="center" fz={28} c="white">
        <IconHome />
      </Text>
    </Box>
  );
}
