import { em, Flex, Text } from "@mantine/core";
import GanttDiagram from "../../features/GanttDiagram/ui/GanttDiagram";

import { useEffect, useState } from "react";
import { useGetFields } from "../../features/Map/model/lib/hooks/useGetFields";
import SelectFieldsManager from "../../widgets/SelectFieldsManagement/SelectFieldsManager";
import { useMediaQuery } from "@mantine/hooks";

export default function JournalCultures() {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const { fields, isLoading } = useGetFields();
  const [selectedFieldId, setSelectedFieldId] = useState<number | undefined>();

  useEffect(() => {
    setSelectedFieldId(fields[0]?.id);
  }, [fields]);

  return (
    <Flex
      h="100%"
      direction={isMobile ? "column" : "row"}
      style={{ overflowY: isMobile ? "scroll" : "hidden" }}
    >
      <SelectFieldsManager
        isLoading={isLoading}
        data={fields}
        selectedFieldId={selectedFieldId}
        onFieldSelect={setSelectedFieldId}
      />

      {fields.length > 0 && (
        <GanttDiagram
          isLoading={isLoading}
          data={fields.find((el) => el.id === selectedFieldId)}
        />
      )}
      {!fields.length && (
        <Text ta="center" w="100%" py={50}>
          Добавьте поля, что бы увидеть график
        </Text>
      )}
    </Flex>
  );
}
