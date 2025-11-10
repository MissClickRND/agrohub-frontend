import { Text, Flex, ActionIcon, Badge, Box } from "@mantine/core";
import { Field } from "../../../features/Map/model/types";
import { IconTrash } from "@tabler/icons-react";
import ModalAcceptAction from "../../../widgets/ModalAcceptAction/ModalAcceptAction";
import { useDisclosure } from "@mantine/hooks";

import { useDeleteZone } from "../../../features/Map/model/lib/hooks/useDeleteZone";

export default function ZoneTemplate({ data }: { data: Field }) {
  const [opened, { open, close }] = useDisclosure(false);
  const { deleteZone } = useDeleteZone();
  const onDelete = () => {
    deleteZone(data.id);
    close();
  };

  return (
    <>
      <ModalAcceptAction
        subtitle="Это действие невозможно будет отменить"
        text={`Вы точно хотите удалить поле ${data.name}?`}
        onPass={onDelete}
        opened={opened}
        close={close}
      />
      <Box
        key={data.id ?? data.name}
        p={10}
        bd={"1px solid var(--white-gray)"}
        bdrs={8}
      >
        <Flex justify="space-between">
          <Flex align="center">
            <span
              style={{
                display: "inline-block",
                width: 16,
                height: 16,
                borderRadius: 2,
                background: data.color,
                marginRight: 8,
              }}
            />
            <Text fw={600}>{data.name}</Text>
          </Flex>
          <ActionIcon
            component="div"
            variant="transparent"
            c="red"
            h={20}
            w={20}
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
            title="Удалить поле"
          >
            <IconTrash height={16} width={16} />
          </ActionIcon>
        </Flex>
        <Badge mt={6} variant="light">
          Площадь: {`${((data.area ?? 0) / 10000).toFixed(1)} га`}
        </Badge>
      </Box>
    </>
  );
}
