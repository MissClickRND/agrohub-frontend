import { Flex } from "@mantine/core";
import GanttDiagram from "../../features/GanttDiagram/ui/GanttDiagram";

import { useEffect, useState } from "react";
import { useGetFields } from "../../features/Map/model/lib/hooks/useGetFields";
import SelectFieldsManager from "../../widgets/SelectFieldsManagement/SelectFieldsManager";

export default function JournalCultures() {
  const { fields, isLoading } = useGetFields();
  const [selectedFieldId, setSelectedFieldId] = useState<number | undefined>();

  useEffect(() => {
    setSelectedFieldId(fields[0]?.id);
  }, [fields]);

  return (
    <Flex h="100%">
      <SelectFieldsManager
        isLoading={isLoading}
        data={fields}
        selectedFieldId={selectedFieldId}
        onFieldSelect={setSelectedFieldId}
      />

      <GanttDiagram
        isLoading={isLoading}
        data={fields.find((el) => el.id === selectedFieldId)}
      />
    </Flex>
  );
}
