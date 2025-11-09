export type Field = {
  id?: number;
  name: string;
  color: string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  zones?: []; //количество зон или массив инфы о зонах
  soil?: string; // название грунта
  area?: number; // площадь
};
