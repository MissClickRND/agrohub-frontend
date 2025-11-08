import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { Modal, TextInput, ColorPicker, Group, Button } from "@mantine/core";
// @ts-ignore
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import { Field } from "../model/types";

export type AgroHubMapHandle = {
  startDrawing: () => void;
};

export const AgroHubMap = forwardRef<
  AgroHubMapHandle,
  {
    data: Field[];
    isDrawing: boolean;
    onDrawingComplete: (field: Field) => void;
    onCancelDrawing: () => void;
  }
>(({ data, isDrawing, onDrawingComplete, onCancelDrawing }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [fieldColor, setFieldColor] = useState("#3388ff");
  const [pendingLayer, setPendingLayer] = useState<L.Polygon | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const drawControlRef = useRef<any>(null);
  const labelLayersRef = useRef<L.LayerGroup>(L.layerGroup());

  const allFields = useMemo(() => data, [data]);

  useImperativeHandle(ref, () => ({
    startDrawing: () => {
      if (drawControlRef.current) {
        drawControlRef.current._toolbars.draw._modes.polygon.handler.enable();
      }
    },
  }));

  useEffect(() => {
    const map = L.map("map", { attributionControl: false }).setView(
      [55.751244, 37.618423],
      8
    );
    mapRef.current = map;

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;
    labelLayersRef.current.addTo(map);

    const drawControl = new (L as any).Control.Draw({
      edit: { featureGroup: drawnItems, edit: false, remove: false },
      draw: {
        polyline: false,
        circle: false,
        rectangle: false,
        marker: false,
        circlemarker: false,
        polygon: {
          allowIntersection: false,
          shapeOptions: { color: "#3388ff", weight: 4 },
        },
      },
    });

    map.addControl(drawControl);
    drawControlRef.current = drawControl;

    const container = (drawControl as any).getContainer?.();
    if (container) (container as HTMLElement).style.display = "none";

    map.on((L as any).Draw.Event.CREATED, (e: any) => {
      const layer = e.layer as L.Polygon;
      layer.setStyle({ color: "#aaa", fillOpacity: 0.1 });
      drawnItems.addLayer(layer);

      setPendingLayer(layer);
      setFieldName(`Поле ${allFields.length + 1}`);
      setFieldColor("#3388ff");
      setIsModalOpen(true);
    });

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (isDrawing && drawControlRef.current) {
      drawControlRef.current._toolbars.draw._modes.polygon.handler.enable();
    }
  }, [isDrawing]);

  useEffect(() => {
    if (!mapRef.current || !drawnItemsRef.current) return;

    drawnItemsRef.current.clearLayers();
    labelLayersRef.current.clearLayers();

    allFields.forEach((field) => {
      const geoJson: GeoJSON.Polygon = {
        type: "Polygon",
        coordinates: field.geometry,
      };

      const layer = L.geoJSON(geoJson, {
        style: { color: field.color, weight: 2, fillOpacity: 0.2 },
      }) as L.Polygon;

      drawnItemsRef.current!.addLayer(layer);

      const center = layer.getBounds().getCenter();
      const labelIcon = L.divIcon({
        className: "",
        html: `<div style="
          background: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          color: ${field.color};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 120px;
          width: max-content;
          min-width: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          text-align: center;
          pointer-events: none;
        ">${field.name}</div>`,
        iconSize: [0, 0],
      });
      L.marker(center, { icon: labelIcon }).addTo(labelLayersRef.current);
    });

    if (allFields.length > 0) {
      const group = L.featureGroup();
      allFields.forEach((field) => {
        group.addLayer(
          L.geoJSON({
            type: "Polygon",
            coordinates: field.geometry,
          })
        );
      });
      mapRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }, [allFields]);

  const handleAddField = () => {
    if (!pendingLayer || !mapRef.current) return;

    const name = fieldName.trim() || `Поле ${allFields.length + 1}`;
    const color = fieldColor;

    pendingLayer.setStyle({ color, weight: 2, fillOpacity: 0.2 });

    const geoJsonFeature =
      pendingLayer.toGeoJSON() as GeoJSON.Feature<GeoJSON.Polygon>;

    const field: Field = {
      name,
      color,
      geometry: geoJsonFeature.geometry.coordinates,
    };

    console.log("СОЗДАЛОСЬ - ", field.geometry);

    onDrawingComplete(field);

    setPendingLayer(null);
    setIsModalOpen(false);
  };

  const handleCancelField = () => {
    if (pendingLayer && drawnItemsRef.current) {
      drawnItemsRef.current.removeLayer(pendingLayer);
    }
    setPendingLayer(null);
    setIsModalOpen(false);
    onCancelDrawing();
  };

  return (
    <>
      <div
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          borderRadius: "0px 8px 0px 8px",
          overflow: "hidden",
        }}
      >
        <div id="map" style={{ height: "100%", width: "100%" }} />
      </div>

      <Modal
        opened={isModalOpen}
        onClose={handleCancelField}
        title="Новое поле"
        centered
        zIndex={9999}
      >
        <TextInput
          label="Название"
          value={fieldName}
          onChange={(e) => setFieldName(e.currentTarget.value)}
        />
        <ColorPicker
          value={fieldColor}
          onChange={setFieldColor}
          swatches={["#3388ff", "#ff5555", "#4caf50", "#ff9800", "#9c27b0"]}
          mt="md"
        />
        <Group mt="md">
          <Button onClick={handleAddField}>Создать</Button>
          <Button variant="outline" onClick={handleCancelField}>
            Отмена
          </Button>
        </Group>
      </Modal>
    </>
  );
});

AgroHubMap.displayName = "AgroHubMap";
