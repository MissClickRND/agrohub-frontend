import { Stack, Text, Flex, Button, Box } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Field } from "../../../features/Map/model/types";
import FieldTemplate from "./FieldTemplate";

export default function FieldManagement({
  onAddField,
  data,
  onFieldSelect,
  selectedFieldId,
}: {
  onAddField: () => void;
  data: Field[];
  onFieldSelect: (id: number | undefined) => void;
  selectedFieldId: number | undefined;
}) {
  return (
    <Stack mih="100%" gap={0} w={400}>
      <Flex
        justify="space-between"
        p={16}
        style={{ borderBottom: "1px solid var(--white-gray)" }}
      >
        <Text fw={500} fz={18}>
          Управление полями
        </Text>
      </Flex>
      <Button color="primary.4" m={16} onClick={onAddField}>
        <Box mr={8}>
          <IconPlus />
        </Box>
        Добавить поле
      </Button>
      <Flex gap={8} px={16} direction="column">
        {data?.map((el) => (
          <FieldTemplate
            key={el?.id}
            data={el}
            isSelected={selectedFieldId === el.id}
            onSelect={() => onFieldSelect(el?.id)}
          />
        ))}
      </Flex>
    </Stack>
  );
}
