export type GeoPolygon = {
  type: "Polygon";
  coordinates: [number, number][][];
};

export type Zone = {
  id?: number;
  name: string;
  color: string;
  geometry: GeoPolygon;
  soil?: string;
  area?: number;
};

export type Field = {
  id?: number;
  name: string;
  color: string;
  geometry: GeoPolygon;
  zones?: Zone[]; // для шаблона списка
  soil?: string;
  area?: number;
};