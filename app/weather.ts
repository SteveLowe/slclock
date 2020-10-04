import document from "document";
import {
  WeatherResult,
  MessageResponse,
  WeatherConditionAsText,
} from "../common";
import asap from "fitbit-asap/app";
import cache from "./fsCache";

const iconLabel = document.getElementById(
  "weather-icon"
) as ImageElement | null;
const temperatureLabel = document.getElementById("weather-temperature");
const locationLabel = document.getElementById("weather-location");
const textLabel = document.getElementById("weather-text");

const cacheKey = "Weather";
const cacheRenewTtl = 60; // 1m
const cacheTtl = 60 * 60; // 1h

export function updateWeather(): void {
  const weather = cache.get<WeatherResult>(cacheKey, cacheRenewTtl);
  if (!weather?.hasData) {
    asap.send({ command: "Weather" }, { timeout: cacheRenewTtl * 1000 });
  }
}

function showCurrentWeather(): void {
  if (!temperatureLabel || !iconLabel || !locationLabel || !textLabel) {
    return;
  }

  const currentWeather = cache.get<WeatherResult>(cacheKey, cacheTtl);
  if (currentWeather?.hasData) {
    iconLabel.href = `img/${currentWeather.condition}.png`;
    temperatureLabel.text = `${currentWeather.temperatureC}°C`;
    locationLabel.text = currentWeather.location;
    textLabel.text = WeatherConditionAsText[currentWeather.condition];
  } else {
    iconLabel.href = "";
    temperatureLabel.text = "";
    locationLabel.text = "";
  }
}

asap.cancel();
asap.onmessage = (message: MessageResponse<WeatherResult>): void => {
  console.log(`Received message: ${JSON.stringify(message)}`);
  if (message.command === "Weather") {
    cache.set(cacheKey, message.data);
    showCurrentWeather();
  }
};

showCurrentWeather();
