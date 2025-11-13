// pages/Grounds/GroundsPage.tsx
import { em, Flex, Stack } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";

import GroundsTable from "./components/GroundsTable";
import CreateMapPointModal from "./components/CreateMapPointModal";
import { useGetFields } from "../../features/Map/model/lib/hooks/useGetFields";
import SelectFieldsManager from "../../widgets/SelectFieldsManagement/SelectFieldsManager";
import GroundHeader from "./components/GroundHeader";

const GroundsPage = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const { fields, isLoading } = useGetFields();
  const [selectedFieldId, setSelectedFieldId] = useState<number | undefined>();
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    setSelectedFieldId(fields?.[0]?.id);
  }, [fields]);

  return (
    <>
      <CreateMapPointModal opened={opened} onClose={close} />
      <Flex h="100%" direction={isMobile ? "column" : "row"}>
        <SelectFieldsManager
          isLoading={isLoading}
          data={fields}
          selectedFieldId={selectedFieldId}
          onFieldSelect={setSelectedFieldId}
        />

        <Stack
          gap={0}
          style={{ width: isMobile ? "100%" : "calc(100% - 280px)" }}
        >
          <GroundHeader open={open} />

          <GroundsTable
            fields={fields}
            key={selectedFieldId ?? "no-field"}
            fieldId={selectedFieldId}
          />
        </Stack>
      </Flex>
    </>
  );
};

export default GroundsPage;
