import { useRef, useState } from "react";
import { Grid } from "@mantine/core";
import FieldManagement from "./components/FieldManagement";
import FieldViewer, { FieldViewerHandle } from "./components/FieldViewer";
import { useGetFields } from "../../features/Map/model/lib/hooks/useGetFields";

const Fields = () => {
  const { fields, isLoading } = useGetFields();
  const [selectedFieldId, setSelectedFieldId] = useState<number | undefined>();
  const viewerRef = useRef<FieldViewerHandle>(null);

  return (
    <Grid gutter={0} h={"100%"} styles={{ inner: { height: "100%" } }}>
      <Grid.Col
        style={{ borderRight: "1px solid var(--white-gray)" }}
        span={"content"}
      >
        <FieldManagement
          isLoading={isLoading}
          data={fields}
          selectedFieldId={selectedFieldId}
          onFieldSelect={setSelectedFieldId}
          onAddField={() => viewerRef.current?.startFieldDrawing()}
        />
      </Grid.Col>

      <Grid.Col span={"auto"}>
        <FieldViewer
          ref={viewerRef}
          fields={fields}
          selectedFieldId={selectedFieldId}
        />
      </Grid.Col>
    </Grid>
  );
};

export default Fields;
