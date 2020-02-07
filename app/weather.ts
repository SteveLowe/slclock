import document from "document";
import { WeatherResult, MessageResponse } from "../common";
import asap from "fitbit-asap/app";
import cache from "./fsCache";

const iconLabel = document.getElementById(
  "weather-icon"
) as ImageElement | null;
const currentLabel = document.getElementById("weather-current");
const locationLabel = document.getElementById("weather-location");

const cacheKey = "Weather";
const cacheRenewTtl = 10 * 60; // 10m
const cacheTtl = 60 * 60; // 1h

export function updateWeather(): void {
  if (!cache.get(cacheKey, cacheRenewTtl)) {
    asap.send({ command: "Weather" }, { timeout: 60 * 1000 });
  }
}

function showCurrentWeather(): void {
  if (!currentLabel || !iconLabel || !locationLabel) {
    return;
  }

  const currentWeather = cache.get<WeatherResult>(cacheKey, cacheTtl);
  if (currentWeather?.hasData) {
    iconLabel.href = `img/${currentWeather.condition}.png`;
    currentLabel.text = `${currentWeather.temperatureC}°C`;
    locationLabel.text = currentWeather.location;
  } else {
    iconLabel.href = "";
    currentLabel.text = "";
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
