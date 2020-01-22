export interface WeatherResult {
  hasData: boolean;
  location: string;
  temperatureC: number;
  condition: WeatherCondition;
  timestamp: string;
}

export type WeatherCondition =
  | "unknown"
  | "clear"
  | "fewClouds"
  | "scatteredClouds"
  | "brokenClouds"
  | "showers"
  | "rain"
  | "thunderstorms"
  | "snow"
  | "mist";
