import { Modal, Flex } from "@mantine/core";
import { useGetCulture } from "../../../features/GanttDiagram/model/lib/hooks/useGetCultures";
import { useMemo, useState } from "react";
import { useGetFields } from "../../../features/Map/model/lib/hooks/useGetFields";
import MapSetPoint from "../../../features/grounds/ui/MapSetPoint";
import SetGroundInfoForm from "../../../features/grounds/ui/SetGroundInfoForm";

export default function CreateMapPointModal({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const { cultures } = useGetCulture();
  const { fields } = useGetFields();
  const [coordinates, setCoordinates] = useState<number[] | null>(null);
  const cultureList = useMemo(() => cultures, [cultures]);

  return (
    <Modal
      onClose={onClose}
      opened={opened}
      title="Внесение данных о почве"
      size="auto"
    >
      <Flex>
        <MapSetPoint
          fields={fields}
          coords={coordinates}
          setCoords={setCoordinates}
        />

        <SetGroundInfoForm coordinates={coordinates} />
      </Flex>
    </Modal>
  );
}
