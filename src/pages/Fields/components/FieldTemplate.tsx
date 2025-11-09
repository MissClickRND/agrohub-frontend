import { Text, Flex, ActionIcon, UnstyledButton } from "@mantine/core";
import { Field } from "../../../features/Map/model/types";
import { IconTrash } from "@tabler/icons-react";

export default function FieldTemplate({
  data,
  isSelected,
  onSelect,
}: {
  data: Field;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <UnstyledButton
      onClick={onSelect}
      p={12}
      bdrs={8}
      w="100%"
      bd={`2px solid ${isSelected ? "var(--main-color)" : "var(--white-gray)"}`}
      style={{ transition: "border-color 0.2s" }}
    >
      <Flex justify="space-between" align="center">
        <Text fz={14}>{data.name}</Text>
        <ActionIcon component="div" variant="transparent" c="red" h={20} w={20}>
          <IconTrash height={16} width={16} />
        </ActionIcon>
      </Flex>

      <Text fz={12} c="var(--subtitle)" mt={4}>
        Площадь: {data.area} га
      </Text>
      <Text fz={12} c="var(--subtitle)">
        Почва: {data.soil}
      </Text>
      <Text fz={12} c="var(--subtitle)">
        Зон: {data.zone}
      </Text>
    </UnstyledButton>
  );
}
