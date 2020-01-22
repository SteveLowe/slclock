import { getCurrentPositionAsync } from "./gps";
import * as openWeatherApi from "./openWeatherApi";
import asap from "fitbit-asap/companion";
import { MessageResponse, WeatherResult, isRecent } from "../common";
import * as storage from "./storage";
import { getSetting, handleSettingChange } from "./settings";
import { settingsStorage } from "settings";

const weatherCacheSeconds = 10 * 60; // 10m

let apiKey = getSetting<string>("weatherApiKey");

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
      timestamp: new Date().toISOString()
    };
  }

  return result;
}

/**
 * Get the current weather of the current location
 * Will return cached data if available and recent
 */
export async function getCurrentWeatherAsync(): Promise<WeatherResult> {
  // return cached weather if available an recent
  const cachedWeather = storage.getItem<WeatherResult>("weather");
  if (cachedWeather && isRecent(cachedWeather.timestamp, weatherCacheSeconds)) {
    return cachedWeather;
  }

  const result = await getNewCurrentWeather();

  // save weather to cache
  storage.setItem("weather", result);

  return result;
}

/**
 * get current weather data, and post as message to app
 */
export async function sendCurrentWeather(): Promise<void> {
  const weather = await getCurrentWeatherAsync();
  const message: MessageResponse<WeatherResult> = {
    command: "Weather",
    data: weather
  };
  asap.send(message);
}

function clearCachedWeather(): void {
  settingsStorage.removeItem("weather");
}

settingsStorage.addEventListener("change", evt =>
  handleSettingChange(evt, "weatherApiKey", newValue => {
    apiKey = newValue;
    clearCachedWeather();
    sendCurrentWeather();
  })
);
