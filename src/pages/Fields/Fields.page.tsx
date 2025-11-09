import { useEffect, useState } from "react";
import { Grid } from "@mantine/core";
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
    <Grid gutter={0} h={"100%"} styles={{ inner: { height: "100%" } }}>
      <Grid.Col
        style={{ borderRight: "1px solid var(--white-gray)" }}
        span={"content"}
      >
        <FieldManagement
          onAddField={() => setIsDrawing(true)}
          data={data}
          onFieldSelect={setSelectedFieldId}
          selectedFieldId={selectedFieldId}
        />
      </Grid.Col>
      <Grid.Col span={"auto"}>
        <FieldViewer
          data={data}
          isDrawing={isDrawing}
          onDrawingComplete={async (newField) => {
            setIsDrawing(false);
          }}
          onCancelDrawing={() => setIsDrawing(false)}
          selectedFieldId={selectedFieldId}
        />
      </Grid.Col>
    </Grid>
  );
};

export default Fields;
