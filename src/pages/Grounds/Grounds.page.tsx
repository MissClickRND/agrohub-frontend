import { IconMap } from "@tabler/icons-react";
import GroundsTable from "./components/GroundsTable.tsx";
import { Box, Button, Flex, Stack, Text } from "@mantine/core";
import CreateMapPointModal from "./components/CreateMapPointModal.tsx";
import { useDisclosure } from "@mantine/hooks";
import { useGetFields } from "../../features/Map/model/lib/hooks/useGetFields.ts";
import { useEffect, useState } from "react";
import SelectFieldsManager from "../../widgets/SelectFieldsManagement/SelectFieldsManager.tsx";
import GroundHeader from "./components/GroundHeader.tsx";

const GroundsPage = () => {
  const { fields, isLoading } = useGetFields();
  const [selectedFieldId, setSelectedFieldId] = useState<number | undefined>();
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    setSelectedFieldId(fields[0]?.id);
  }, [fields]);

  return (
    <>
      <CreateMapPointModal opened={opened} onClose={close} />
      <Flex h="100%">
        <SelectFieldsManager
          isLoading={isLoading}
          data={fields}
          selectedFieldId={selectedFieldId}
          onFieldSelect={setSelectedFieldId}
        />
        <Stack gap={0} style={{ width: "calc(100% - 280px)" }}>
          <GroundHeader open={open} />
          <GroundsTable fieldId={selectedFieldId} />
        </Stack>
      </Flex>
    </>
  );
};

export default GroundsPage;
