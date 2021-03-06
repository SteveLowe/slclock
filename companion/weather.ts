import { getCurrentPositionAsync } from "./gps";
import * as openWeatherApi from "./openWeatherApi";
import asap from "fitbit-asap/companion";
import { MessageResponse, WeatherResult } from "../common";
import storage from "./storage";
import { getSetting, handleSettingChange } from "./settings";
import { settingsStorage } from "settings";
import { me } from "companion";

const cacheKey = "weather";
const cacheTtl = 10 * 60; // 10m

let apiKey = getSetting<string>("weatherApiKey");
let cacheWeather = getSetting<boolean>("weatherCacheEnabled");

async function getNewCurrentWeather(): Promise<WeatherResult> {
  console.log("Requesting Weather");
  let result: WeatherResult | undefined;
  if (apiKey) {
    try {
      const position = await getCurrentPositionAsync();
      result = await openWeatherApi.getCurrentWeatherAsync(
        position.coords.latitude,
        position.coords.longitude,
        apiKey
      );
    } catch (err) {
      console.error(`Weather request failed: ${err}`);
    }
  }

  if (!result) {
    result = {
      hasData: false,
      location: "",
      temperatureC: 0,
      condition: "unknown",
      timestamp: new Date().toISOString(),
    };
  }

  return result;
}

/**
 * Get the current weather of the current location
 * Will return cached data if available and recent
 */
const getCurrentWeatherAsync = (): Promise<WeatherResult> => {
  return cacheWeather
    ? storage.getOrAddAsync<WeatherResult>(
        cacheKey,
        cacheTtl,
        getNewCurrentWeather
      )
    : getNewCurrentWeather();
};

/**
 * get current weather data, and post as message to app
 */
export async function sendCurrentWeather(): Promise<void> {
  const weather = await getCurrentWeatherAsync();
  const message: MessageResponse<WeatherResult> = {
    command: "Weather",
    data: weather,
  };
  console.log(`Sending weather: ${weather.hasData}`);
  asap.send(message);
}

function clearCachedWeather(): void {
  storage.remove(cacheKey);
}

settingsStorage.addEventListener("change", (evt) => {
  handleSettingChange<string>(evt, "weatherApiKey", (newValue) => {
    apiKey = newValue;
    clearCachedWeather();
    sendCurrentWeather();
  });
  handleSettingChange<boolean>(evt, "weatherCachedEnabled", (newValue) => {
    cacheWeather = newValue;
    clearCachedWeather();
    sendCurrentWeather();
  });
});

me.monitorSignificantLocationChanges = true;
me.onsignificantlocationchange = () => {
  clearCachedWeather();
  sendCurrentWeather();
};
