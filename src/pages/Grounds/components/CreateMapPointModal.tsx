import { Modal } from "@mantine/core";

export default function CreateMapPointModal({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      onClose={onClose}
      opened={opened}
      title="Внесение данных о почве"
      size="auto"
    >
        
    </Modal>
  );
}
