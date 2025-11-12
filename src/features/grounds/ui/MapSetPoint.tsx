import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
  Tooltip,
} from "react-leaflet";
//@ts-ignore
import type { LatLngExpression } from "leaflet";
//@ts-ignore
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Zone } from "../../Map/model/types";

type FieldT = {
  id?: number;
  name: string;
  area?: number;
  color: string;
  geometry: GeoJSON.Polygon;
  zones?: Zone[];
};

type Props = {
  fields: FieldT[] | undefined;
  coords: number[] | null; // [lon, lat]
  setCoords: (c: number[] | null) => void;
};

const DEFAULT_CENTER: LatLngExpression = [55.75, 37.62];
const DEFAULT_ZOOM = 8;

function FitBoundsOnce({ fields }: { fields: FieldT[] | undefined }) {
  const map = useMap();
  const fittedRef = useRef(false);

  useEffect(() => {
    if (fittedRef.current || !fields || fields.length === 0) return;
    const all = new L.FeatureGroup();

    fields.forEach((f) => {
      const gj = L.geoJSON(f.geometry as any);
      all.addLayer(gj);
      (f.zones ?? []).forEach((z) => {
        const zj = L.geoJSON(z.geometry as any);
        all.addLayer(zj);
      });
    });

    if (all.getLayers().length) {
      map.fitBounds(all.getBounds().pad(0.1));
      fittedRef.current = true;
    }
  }, [fields, map]);

  return null;
}

export default function MapSetPoint({ fields, coords, setCoords }: Props) {
  const fieldLayers = useMemo(() => fields ?? [], [fields]);

  const fieldStyle = (color: string): L.PathOptions => ({
    color,
    weight: 2,
    fillColor: color,
    fillOpacity: 0.1,
  });

  const zoneStyle = (color: string): L.PathOptions => ({
    color,
    weight: 2,
    dashArray: "4,4",
    fillColor: color,
    fillOpacity: 0.25,
  });

  const handleClickLatLng = (lat: number, lng: number) => {
    setCoords([lng, lat]); // маркер теперь будет двигаться за coords
  };

  return (
    <MapContainer
      attributionControl={false}
      style={{ width: "30vw", height: "60vh", borderRadius: 12 }}
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      whenReady={(e) => {
        e.target.on("click", (ev: any) => {
          const { lat, lng } = ev.latlng;
          handleClickLatLng(lat, lng);
        });
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <FitBoundsOnce fields={fieldLayers} />

      {fieldLayers.map((f) => (
        <GeoJSON
          key={`field-${f.id}`}
          data={f.geometry as any}
          style={() => fieldStyle(f.color)}
          eventHandlers={{
            click: (e) => {
              const { latlng } = e as any;
              handleClickLatLng(latlng.lat, latlng.lng);
            },
          }}
        >
          <Tooltip sticky>
            <div>
              <b>{f.name}</b>
              <br />
              Площадь: {Math.round(f.area / 10000)} га
            </div>
          </Tooltip>
        </GeoJSON>
      ))}

      {fieldLayers.flatMap((f) =>
        (f.zones ?? []).map((z) => (
          <GeoJSON
            key={`zone-${f.id}-${z.id}`}
            data={z.geometry as any}
            style={() => zoneStyle(z.color)}
            eventHandlers={{
              click: (e) => {
                const { latlng } = e as any;
                handleClickLatLng(latlng.lat, latlng.lng);
              },
            }}
          >
            <Tooltip sticky>
              <div>
                <b>{z.name}</b>
                <br />
                Поле: {f.name}
                <br />
                Площадь:{Math.round(f.area / 10000)} га
              </div>
            </Tooltip>
          </GeoJSON>
        ))
      )}

      {/* Маркер теперь привязан к текущим coords и будет перемещаться */}
      {coords && (
        <GeoJSON
          key={`point-${coords[0]}-${coords[1]}`} // ключ включает координаты — форсит перерисовку
          data={
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: coords },
              properties: {},
            } as any
          }
          pointToLayer={(_, latlng) =>
            L.circleMarker(latlng, { radius: 6, weight: 2, fillOpacity: 1 })
          }
        />
      )}
    </MapContainer>
  );
}
