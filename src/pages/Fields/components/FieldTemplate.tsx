import { Box, Text, Flex, ActionIcon } from "@mantine/core";
import { Field } from "../../../features/Map/model/types";
import { IconTrash } from "@tabler/icons-react";

export default function FieldTemplate({ data }: { data: Field }) {
  return (
    <Box p={12} bdrs={8} w="100%" bd="2px solid var(--white-gray)">
      <Flex justify="space-between" align="center">
        <Text fz={14}>{data.name}</Text>
        <ActionIcon variant="transparent" c="red" h={10} w={10}>
          <IconTrash height={16} width={16} />
        </ActionIcon>
      </Flex>

      <Text fz={12} c="var(--subtitle)">
        Площадь: {data.square} га
      </Text>
      <Text fz={12} c="var(--subtitle)">
        Почва: {data.soil}
      </Text>
      <Text fz={12} c="var(--subtitle)">
        Зон: {data.zone}
      </Text>
    </Box>
  );
}
