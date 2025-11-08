import { Stack, Text, Flex, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Field } from "../../../features/Map/model/types";
import FieldTemplate from "./FieldTemplate";

export default function FieldManagment({ data }: { data: Field[] }) {
  return (
    <Stack
      mih="100%"
      gap={0}
      w={300}
      bdrs={8}
      bd={"1px solid var(--white-gray)"}
    >
      <Flex
        justify="space-between"
        p={16}
        style={{
          borderBottom: "1px solid var(--white-gray)",
        }}
      >
        <Text fw={500} fz={18}>
          Управление полями
        </Text>
      </Flex>
      <Button color="var(--main-color)" m={16}>
        <Flex>
          <IconPlus /> <Text>Добавить поле</Text>
        </Flex>
      </Button>
      <Flex gap={8} px={16}>
        {data.map((el) => (
          <FieldTemplate key={el.id} data={el} />
        ))}
      </Flex>
    </Stack>
  );
}
