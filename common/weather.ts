import { CacheItem } from "./cache";

export interface WeatherResult extends CacheItem {
  hasData: boolean;
  location: string;
  temperatureC: number;
  condition: WeatherCondition;
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
