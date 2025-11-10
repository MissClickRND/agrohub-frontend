import { useRef, useState } from "react";
import { Grid } from "@mantine/core";
import FieldManagement from "./components/FieldManagement";
import FieldViewer, { FieldViewerHandle } from "./components/FieldViewer";
import { useGetFields } from "../../features/Map/model/lib/hooks/useGetFields";

type DrawMode = "idle" | "field" | "zone";

const Fields = () => {
  const { fields, isLoading } = useGetFields();
  const [selectedFieldId, setSelectedFieldId] = useState<number | undefined>();
  const viewerRef = useRef<FieldViewerHandle>(null);

  const [mode, setMode] = useState<DrawMode>("idle");

  const onMapModeChange = (m: DrawMode) => setMode(m);

  const toggleFieldDrawing = () => {
    if (mode === "field") viewerRef.current?.cancelDrawing();
    else viewerRef.current?.startFieldDrawing();
  };
  const toggleZoneDrawing = () => {
    if (!selectedFieldId) return;
    if (mode === "zone") viewerRef.current?.cancelDrawing();
    else viewerRef.current?.startZoneDrawing();
  };

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
          isFieldDrawing={mode === "field"}
          onToggleFieldDrawing={toggleFieldDrawing}
        />
      </Grid.Col>

      <Grid.Col span={"auto"}>
        <FieldViewer
          ref={viewerRef}
          fields={fields}
          selectedFieldId={selectedFieldId}
          isZoneDrawing={mode === "zone"}
          onToggleZoneDrawing={toggleZoneDrawing}
          onMapModeChange={onMapModeChange}
        />
      </Grid.Col>
    </Grid>
  );
};

export default Fields;
