import { Button, Flex, Modal, Text } from "@mantine/core";

export default function ModalAcceptAction({
  text,
  onPass,
  opened,
  close,
}: {
  text: string;
  onPass: () => void;
  opened: boolean;
  close: () => void;
}) {
  return (
    <Modal
      opened={opened}
      onClose={close}
      withCloseButton={false}
      size="auto"
      centered
    >
      <Text fz={24}>{text}</Text>
      <Text fz={14} c={"var(--subtitle)"}>
        Это действие невозможно будет отменить
      </Text>
      <Flex py={10} gap={10}>
        <Button color="red" onClick={close}>
          Отменить
        </Button>
        <Button color="green" onClick={onPass}>
          Подтвердить
        </Button>
      </Flex>
    </Modal>
  );
}
