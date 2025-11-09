export type Field = {
  id?: number;
  name: string;
  color: string;
  geometry: number[][][];
  zone?: number; //количество зон или массив инфы о зонах
  soil?: string; // название грунта
  area?: number; // площадь
};
