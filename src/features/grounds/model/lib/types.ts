export type GroundData = {
  N: number | null;
  P: number | null;
  K: number | null;
  Temperature: number | null;
  Humidity: number | null;
  RainFall: number | null;
  pH: number | null;
  coordinates: number[] | null;
  date: Date | string | null;
};

export type IResponseDataGround = {
  field_id: number;
  field_name: string;
  zones: IResponseGround[];
};

export type IZoneResponse = {
  id: number;
  name: string;
  grounds: IResponseGround[];
};

export type IResponseGround = {
  id: number;
  N: number;
  P: number;
  K: number;
  Temperature: number;
  Humidity: number;
  RainFall: number;
  pH: number;
  location: {
    type: string;
    coordinates: number[];
  };

  createdAt: Date | string;
};
