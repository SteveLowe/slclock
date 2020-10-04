// Partial wrapper around OpenWeatherMap Api

import { WeatherCondition, WeatherResult } from "../common";

const urlBase = "https://api.openweathermap.org/data/2.5";

async function getAsync<T>(
  url: string,
  query: string,
  apiKey: string
): Promise<T> {
  const fullUrl = `${urlBase}/${url}?${query}&APPID=${apiKey}`;
  const response = await fetch(fullUrl);
  if (!response.ok) {
    throw `http request failed: ${response.status} ${response.statusText}`;
  }
  const data: T = await response.json();
  return data;
}

const conditionMap: { [key: string]: WeatherCondition } = {
  "01": "clear",
  "02": "fewClouds",
  "03": "scatteredClouds",
  "04": "brokenClouds",
  "09": "showers",
  "10": "rain",
  "11": "thunderstorms",
  "13": "snow",
  "50": "mist",
};
export function parseCondition(
  element: WeatherElement | undefined
): WeatherCondition {
  if (!element?.icon || element.icon.length < 2) {
    return "unknown";
  }

  const iconNum = element.icon.substr(0, 2);
  const condition = conditionMap[iconNum];
  return condition ?? "unknown";
}

export async function getCurrentWeatherAsync(
  lat: number,
  lon: number,
  apiKey: string
): Promise<WeatherResult> {
  if (!apiKey) {
    throw "no api key";
  }
  console.log("Get new weather");
  const data = await getAsync<OpenWeatherResult>(
    "weather",
    `lat=${lat}&lon=${lon}&units=metric`,
    apiKey
  );
  const result: WeatherResult = {
    hasData: true,
    location: data.name.substr(0, 24),
    temperatureC: Math.round(data.main.temp * 10) / 10, // force 1dp
    condition: parseCondition(data.weather[0]),
    timestamp: new Date().toISOString(),
  };
  return result;
}

export interface OpenWeatherResult {
  coord: Coord;
  weather: WeatherElement[];
  base: string;
  main: Main;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface Clouds {
  all: number;
}

export interface Coord {
  lon: number;
  lat: number;
}

export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface Sys {
  type: number;
  id: number;
  message: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherElement {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Wind {
  speed: number;
  deg: number;
}
