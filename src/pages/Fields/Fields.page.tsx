import { useEffect, useState } from "react";
import { Flex, Paper } from "@mantine/core";
import FieldManagement from "./components/FieldManagement";
import FieldViewer from "./components/FieldViewer";
import { Field } from "../../features/Map/model/types";
import { useGetFields } from "../../features/Map/model/lib/hooks/useGetFields";

const Fields = () => {
  const { getFields } = useGetFields();
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<number | undefined>(
    undefined
  );

  const [data, setData] = useState<Field[]>([]);

  useEffect(() => {
    setData(getFields);
  }, [getFields]);

  return (
    <Paper bg="white" bdrs={16} p={20}>
      <Flex gap={20}>
        <FieldManagement
          onAddField={() => setIsDrawing(true)}
          data={data}
          onFieldSelect={setSelectedFieldId}
          selectedFieldId={selectedFieldId}
        />
        <FieldViewer
          data={data}
          isDrawing={isDrawing}
          onDrawingComplete={async (newField) => {
            setIsDrawing(false);
          }} // потом перерендер
          onCancelDrawing={() => setIsDrawing(false)}
          selectedFieldId={selectedFieldId}
        />
      </Flex>
    </Paper>
  );
};

export default Fields;
