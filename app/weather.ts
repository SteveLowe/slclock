import document from "document";
import {
  WeatherResult,
  MessageRequest,
  MessageResponse,
  isRecent
} from "../common";
import asap from "fitbit-asap/app";

const iconLabel = document.getElementById(
  "weather-icon"
) as ImageElement | null;
const currentLabel = document.getElementById("weather-current");
const locationLabel = document.getElementById("weather-location");
const weatherCacheSeconds = 10 * 60; // 10m
const weatherRequestMessage: MessageRequest = {
  command: "Weather"
};

let currentWeather: WeatherResult | undefined;

export function updateWeather(): void {
  if (!isRecent(currentWeather?.timestamp, weatherCacheSeconds)) {
    asap.send(weatherRequestMessage, { timeout: 60 * 1000 });
  }
}

function showCurrentWeather(): void {
  if (!currentLabel || !iconLabel || !locationLabel) {
    return;
  }

  if (currentWeather && currentWeather.hasData) {
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
  if (message.command == "Weather") {
    currentWeather = message.data;
    showCurrentWeather();
  }
};

showCurrentWeather();
