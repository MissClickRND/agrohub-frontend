import { Box, Text } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";
import { useMeStore } from "../../entities/me/model/meStore";

export default function Main() {
  const { userName } = useMeStore();

  return (
    <Box w="100vw" bg="blue">
      <Text py={50} ta="center" fz={28} c="white">
        <IconHome />
        Главная страница сайта
      </Text>
      <p>USERNAME: {userName}</p>
    </Box>
  );
}
