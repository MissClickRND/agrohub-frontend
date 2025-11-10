export type Field = {
  id?: number;
  name: string;
  color: string;
  geometry: {
    type: string;
    coordinates: [number, number][][];
  };
  zones?: Zone[]; //количество зон или массив инфы о зонах
  soil?: string; // название грунта
  area?: number; // площадь
};

export type Zone = {
  area: number,
  color: string,
  id: number,
  name: string,
  geometry: {
    type: string,
    coordinates: [number, number][][]
  }
}