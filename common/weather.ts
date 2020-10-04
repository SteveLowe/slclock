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

export const WeatherConditionAsText: { [key in WeatherCondition]: string } = {
  unknown: "foo",
  clear: "Clear",
  fewClouds: "Few Clouds",
  scatteredClouds: "Scattered Clouds",
  brokenClouds: "Broken Clouds",
  showers: "Showers",
  rain: "Rain",
  thunderstorms: "Thunderstorm",
  snow: "Snow",
  mist: "Mist",
};
