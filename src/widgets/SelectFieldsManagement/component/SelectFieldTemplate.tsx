import { Text, Flex, ActionIcon, UnstyledButton } from "@mantine/core";
import { Field } from "../../../features/Map/model/types";
import { IconTrash } from "@tabler/icons-react";
import ModalAcceptAction from "../../ModalAcceptAction/ModalAcceptAction";
import { useDisclosure } from "@mantine/hooks";
import { useDeleteField } from "../../../features/Map/model/lib/hooks/useDeleteField";

export default function SelectFieldTemplate({
  data,
  isSelected,
  onSelect,
}: {
  data: Field;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const { deleteField } = useDeleteField();
  const onDelete = () => {
    deleteField(data.id);
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
      <UnstyledButton
        onClick={onSelect}
        p={12}
        bdrs={8}
        w="100%"
        bd={`2px solid ${
          isSelected ? "var(--main-color)" : "var(--white-gray)"
        }`}
        style={{ transition: "border-color 0.2s" }}
      >
        <Flex justify="space-between" align="center">
          <Text fz={14}>{data.name}</Text>
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
        <Text fz={12} c="var(--subtitle)" mt={4}>
          Площадь: {((data.area ?? 0) / 10000).toFixed(1)} га
        </Text>
        <Text fz={12} c="var(--subtitle)">
          Зон: {data?.zones?.length ?? 0}
        </Text>
      </UnstyledButton>
    </>
  );
}
