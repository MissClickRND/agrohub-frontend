export type IRecommendationRequest = {
  duration_months: number; // время сколько он хочет расти
  N: number;
  P: number;
  K: number;
  temperature: number; // на момент высадки
  humidity: number;
  ph: number;
  rainfall: number;
  last_crop_duration: number; // сколько росла последняя
  last_crop: string; // что росло последним
};

export type IRecommendationResponse = {
  top_crops: string[];
};
