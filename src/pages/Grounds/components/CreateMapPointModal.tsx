import { Modal, Flex, Box } from "@mantine/core";

import { useState } from "react";
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
  const { fields } = useGetFields();
  const [coordinates, setCoordinates] = useState<number[] | null>(null);

  return (
    <Modal
      onClose={onClose}
      opened={opened}
      title="Внесение данных о почве"
      size="auto"
      fullScreen
      styles={{
        content: {
          borderRadius: 0,
        },
        body: {
          padding: 0,
        },
      }}
    >
      <Flex direction={{ base: "column", md: "row" }} h="90vh">
        <Box w={{ base: "100%", md: "50%" }} h={{ base: "50%", md: "100%" }}>
          <MapSetPoint
            fields={fields}
            coords={coordinates}
            setCoords={setCoordinates}
          />
        </Box>

        <Box w={{ base: "100%", md: "50%" }} h={{ base: "50%", md: "100%" }}>
          <SetGroundInfoForm close={onClose} coordinates={coordinates} />
        </Box>
      </Flex>
    </Modal>
  );
}
