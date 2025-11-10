import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import FieldModal from "./FieldModal";
import ZoneModal from "./ZoneModal";
// @ts-ignore
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import { Field, Zone } from "../model/types";
import { useSetNewField } from "../model/lib/hooks/useSetNewField";
import { useSetNewZone } from "../model/lib/hooks/useSetNewZone";

export type AgroHubMapHandle = {
  startFieldDrawing: () => void;
  startZoneDrawing: () => void;
};

type Props = {
  fields: Field[];
  zones: Zone[];
  selectedFieldId?: number;
};

type DrawMode = "idle" | "field" | "zone";

const createLabelIcon = (text: string, color: string, fontSize = 12) =>
  L.divIcon({
    className: "",
    html: `<div style="
              background: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
              color: ${color};
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              max-width: 120px;
              width: max-content;
              min-width: 20px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.3);
              text-align: center;
              pointer-events: none;
            ">${text}</div>`,
    iconSize: [0, 0],
  });

export const AgroHubMap = forwardRef<AgroHubMapHandle, Props>(
  ({ fields, zones, selectedFieldId }, ref) => {
    const mapIdRef = useRef(
      `agrohub-map-${Math.random().toString(36).slice(2)}`
    );
    const mapRef = useRef<L.Map | null>(null);

    // Постоянные слои
    const fieldsLayerRef = useRef<L.LayerGroup>(L.layerGroup());
    const fieldsLabelsRef = useRef<L.LayerGroup>(L.layerGroup());
    const zonesLayerRef = useRef<L.LayerGroup>(L.layerGroup());
    const zonesLabelsRef = useRef<L.LayerGroup>(L.layerGroup());
    const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());

    const drawControlRef = useRef<any>(null);

    const [mode, setMode] = useState<DrawMode>("idle");
    const modeRef = useRef<DrawMode>("idle"); // <= всегда актуальный режим
    useEffect(() => {
      modeRef.current = mode;
    }, [mode]);

    const [pendingLayer, setPendingLayer] = useState<L.Polygon | null>(null);

    const { newField } = useSetNewField();
    const { newZone } = useSetNewZone(selectedFieldId);

    const [fieldModalOpen, setFieldModalOpen] = useState(false);
    const [zoneModalOpen, setZoneModalOpen] = useState(false);

    const allFields = useMemo(() => fields, [fields]);
    const firstFitDoneRef = useRef(false);

    const disableDrawing = () => {
      const handler =
        drawControlRef.current?._toolbars?.draw?._modes?.polygon?.handler;
      if (handler?.disable) handler.disable();
    };

    useImperativeHandle(
      ref,
      () => ({
        startFieldDrawing: () => {
          if (!mapRef.current || !drawControlRef.current) return;
          setMode("field");
          drawControlRef.current._toolbars.draw._modes.polygon.handler.enable();
        },
        startZoneDrawing: () => {
          if (selectedFieldId == null) return; // нельзя рисовать зону без выбранного поля
          if (!mapRef.current || !drawControlRef.current) return;
          setMode("zone");
          drawControlRef.current._toolbars.draw._modes.polygon.handler.enable();
        },
      }),
      [selectedFieldId]
    );

    // init map once
    useEffect(() => {
      const map = L.map(mapIdRef.current, {
        attributionControl: false,
      }).setView([55.751244, 37.618423], 8);
      mapRef.current = map;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // порядок важен: лейблы поверх
      fieldsLayerRef.current.addTo(map);
      zonesLayerRef.current.addTo(map);
      fieldsLabelsRef.current.addTo(map);
      zonesLabelsRef.current.addTo(map);
      drawnItemsRef.current.addTo(map);

      const drawControl = new (L as any).Control.Draw({
        edit: {
          featureGroup: drawnItemsRef.current,
          edit: false,
          remove: false,
        },
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

      // скрываем UI draw
      const container = (drawControl as any).getContainer?.();
      if (container) (container as HTMLElement).style.display = "none";

      // ВАЖНО: используем modeRef, а не замыкание на старом mode
      map.on((L as any).Draw.Event.CREATED, (e: any) => {
        const layer = e.layer as L.Polygon;
        // временный серый стиль до подтверждения
        layer.setStyle({ color: "#aaa", fillOpacity: 0.1 });
        drawnItemsRef.current.addLayer(layer);
        setPendingLayer(layer);

        disableDrawing(); // чтобы модалка принимала фокус

        const currentMode = modeRef.current;
        if (currentMode === "field") setFieldModalOpen(true);
        else if (currentMode === "zone") setZoneModalOpen(true);
      });

      return () => map.remove();
    }, []);

    // Пока открыта модалка — карта не перехватывает клавиатуру
    useEffect(() => {
      const map = mapRef.current;
      if (!map) return;
      if (fieldModalOpen || zoneModalOpen) map.keyboard?.disable();
      else map.keyboard?.enable();
    }, [fieldModalOpen, zoneModalOpen]);

    // Поля: всегда показаны + подписи
    useEffect(() => {
      if (!mapRef.current) return;
      fieldsLayerRef.current.clearLayers();
      fieldsLabelsRef.current.clearLayers();

      const fitGroup = L.featureGroup();
      let hasBounds = false;

      allFields.forEach((f) => {
        if (!f?.geometry?.coordinates?.length) return;
        const layer = L.geoJSON(f.geometry as any, {
          style: { color: f.color, weight: 2, fillOpacity: 0.2 },
        }) as L.Polygon;

        fieldsLayerRef.current.addLayer(layer);
        const b = layer.getBounds();
        if (b.isValid()) {
          fitGroup.addLayer(layer);
          hasBounds = true;
          const center = b.getCenter();
          L.marker(center, {
            icon: createLabelIcon(f.name, f.color, 12),
          }).addTo(fieldsLabelsRef.current);
        }
      });

      if (!firstFitDoneRef.current && hasBounds) {
        mapRef.current!.fitBounds(fitGroup.getBounds(), { padding: [50, 50] });
        firstFitDoneRef.current = true;
      }
    }, [allFields]);

    // Перемещение к выбранному полю (по клику в FieldTemplate)
    useEffect(() => {
      if (!mapRef.current || selectedFieldId == null) return;
      const f = fields.find((x) => x.id === selectedFieldId);
      if (!f?.geometry?.coordinates?.length) return;

      const temp = L.geoJSON(f.geometry as any);
      const b = temp.getBounds();
      if (b.isValid()) {
        mapRef.current.flyToBounds(b, {
          padding: [42, 42],
          duration: 0.6,
          easeLinearity: 0.25,
        });
      }
    }, [selectedFieldId, fields]);

    // Зоны выбранного поля: показ + подписи
    useEffect(() => {
      if (!mapRef.current) return;
      zonesLayerRef.current.clearLayers();
      zonesLabelsRef.current.clearLayers();

      if (!selectedFieldId) return;

      const fg = L.featureGroup();
      let hasBounds = false;

      zones.forEach((z) => {
        if (!z?.geometry?.coordinates?.length) return;
        const layer = L.geoJSON(z.geometry as any, {
          style: { color: z.color, weight: 2, fillOpacity: 0.25 },
        }) as L.Polygon;

        zonesLayerRef.current.addLayer(layer);
        const b = layer.getBounds();
        if (b.isValid()) {
          fg.addLayer(layer);
          hasBounds = true;
          const center = b.getCenter();
          L.marker(center, {
            icon: createLabelIcon(z.name, z.color, 11),
          }).addTo(zonesLabelsRef.current);
        }
      });

      if (hasBounds) {
        mapRef.current!.flyToBounds(fg.getBounds(), {
          padding: [40, 40],
          duration: 0.55,
          easeLinearity: 0.25,
        });
      }
    }, [zones, selectedFieldId]);

    const cleanupAfterModal = () => {
      setPendingLayer(null);
      setMode("idle");
      modeRef.current = "idle";
      disableDrawing();
    };

    // Подтверждение создания ПОЛЯ
    const confirmCreateField = ({
      name,
      color,
    }: {
      name: string;
      color: string;
    }) => {
      if (!pendingLayer) return;
      const gj = pendingLayer.toGeoJSON() as GeoJSON.Feature<GeoJSON.Polygon>;

      newField({
        name,
        color,
        geometry: { type: "Polygon", coordinates: gj.geometry.coordinates },
      });

      // мгновенная визуализация
      const layer = L.geoJSON(gj, {
        style: { color, weight: 2, fillOpacity: 0.2 },
      });
      fieldsLayerRef.current.addLayer(layer);
      const center = (layer as any).getBounds().getCenter();
      L.marker(center, { icon: createLabelIcon(name, color, 12) }).addTo(
        fieldsLabelsRef.current
      );

      (drawnItemsRef.current as any).removeLayer(pendingLayer);
      setFieldModalOpen(false);
      cleanupAfterModal();
    };

    // Подтверждение создания ЗОНЫ
    const confirmCreateZone = ({
      name,
      color,
    }: {
      name: string;
      color: string;
    }) => {
      if (!pendingLayer || selectedFieldId == null) return;
      const gj = pendingLayer.toGeoJSON() as GeoJSON.Feature<GeoJSON.Polygon>;

      newZone({
        name,
        color,
        geometry: { type: "Polygon", coordinates: gj.geometry.coordinates },
      });

      // мгновенная визуализация зоны + подписи
      const layer = L.geoJSON(gj, {
        style: { color, weight: 2, fillOpacity: 0.25 },
      });
      zonesLayerRef.current.addLayer(layer);
      const center = (layer as any).getBounds().getCenter();
      L.marker(center, { icon: createLabelIcon(name, color, 11) }).addTo(
        zonesLabelsRef.current
      );

      (drawnItemsRef.current as any).removeLayer(pendingLayer);
      setZoneModalOpen(false);
      cleanupAfterModal();
    };

    const cancelModal = () => {
      if (pendingLayer)
        (drawnItemsRef.current as any).removeLayer(pendingLayer);
      setFieldModalOpen(false);
      setZoneModalOpen(false);
      cleanupAfterModal();
    };

    return (
      <>
        <div
          id={mapIdRef.current}
          style={{
            position: "relative",
            height: "100%",
            width: "100%",
            borderRadius: selectedFieldId
              ? "0px 8px 0px 0px"
              : "0px 0px 8px 8px",
            overflow: "hidden",
            zIndex: 1,
          }}
        />

        <FieldModal
          opened={fieldModalOpen}
          onCancel={cancelModal}
          onSubmit={confirmCreateField}
          defaultColor={"#3388ff"}
        />
        <ZoneModal
          opened={zoneModalOpen}
          onCancel={cancelModal}
          onSubmit={confirmCreateZone}
          defaultColor={"#ff9800"}
        />
      </>
    );
  }
);

AgroHubMap.displayName = "AgroHubMap";
export default AgroHubMap;
