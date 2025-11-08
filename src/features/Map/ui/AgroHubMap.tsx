import { useEffect, useState, useRef } from "react";

import {
  ActionIcon,
  Modal,
  TextInput,
  ColorPicker,
  Group,
  Button,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { v4 as uuidv4 } from "uuid";

// @ts-ignore
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
// @ts-ignore
import "leaflet-draw";

type Field = {
  id: string;
  name: string;
  color: string;
  geometry: GeoJSON.Polygon;
};

export const AgroHubMap = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [fieldColor, setFieldColor] = useState("#3388ff");
  const [pendingLayer, setPendingLayer] = useState<L.Polygon | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const drawControlRef = useRef<any>(null);
  const labelLayersRef = useRef<L.LayerGroup>(L.layerGroup());

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
        // guidelineDistance влияет на логику, но не на визуал — визуал через CSS
        guidelineDistance: 2,
        showArea: false,
        metric: true,
        repeatMode: false,
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
      setFieldName(`Поле ${fields.length + 1}`);
      setFieldColor("#3388ff");
      setIsModalOpen(true);
    });

    return () => {
      map.remove();
    };
  }, []);

  const handleAddField = () => {
    const layer = pendingLayer;
    const map = mapRef.current;
    if (!layer || !map) return;

    const name = fieldName.trim() || `Поле ${fields.length + 1}`;
    const color = fieldColor;

    layer.setStyle({ color, weight: 2, fillOpacity: 0.2 });

    const center = layer.getBounds().getCenter();
    const labelIcon = L.divIcon({
      className: "",
      html: `<div style="
        background: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        color: ${color};
        white-space: nowrap;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        text-align: center;
      ">${name}</div>`,
      iconSize: [100, 20],
    });
    L.marker(center, { icon: labelIcon }).addTo(labelLayersRef.current);

    map.fitBounds(layer.getBounds(), { padding: [50, 50] });

    const geoJsonFeature =
      layer.toGeoJSON() as GeoJSON.Feature<GeoJSON.Polygon>;

    const field: Field = {
      id: uuidv4(),
      name,
      color,
      geometry: geoJsonFeature.geometry,
    };

    console.log("Новое поле создано (GeoJSON):", field);
    console.log("Координаты:", field.geometry.coordinates);

    setFields((prev) => [...prev, field]);
    setPendingLayer(null);
    setIsModalOpen(false);
  };

  const handleCancelField = () => {
    if (pendingLayer && drawnItemsRef.current) {
      drawnItemsRef.current.removeLayer(pendingLayer);
    }
    setPendingLayer(null);
    setIsModalOpen(false);
  };

  const handleClearAll = () => {
    drawnItemsRef.current?.clearLayers();
    labelLayersRef.current.clearLayers();
    setFields([]);
    setPendingLayer(null);
  };

  return (
    <>
      <div
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          borderRadius: "0px 8px 0px 8px ",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1000,
            display: "flex",
            gap: "8px",
          }}
        >
          <ActionIcon
            onClick={() => {
              if (drawControlRef.current) {
                (
                  drawControlRef.current as any
                )._toolbars.draw._modes.polygon.handler.enable();
              }
            }}
            variant="filled"
            color="green"
          >
            <IconPlus size={16} />
          </ActionIcon>
          <ActionIcon onClick={handleClearAll} variant="filled" color="red">
            <IconTrash size={16} />
          </ActionIcon>
        </div>
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
};
