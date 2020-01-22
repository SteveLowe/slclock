import asap from "fitbit-asap/companion";
import { MessageRequest } from "../common";
import * as weather from "./weather";

asap.cancel();
asap.onmessage = (message: MessageRequest): void => {
  console.log(`Received message: ${JSON.stringify(message)}`);
  switch (message.command) {
    case "Weather":
      weather.sendCurrentWeather();
  }
};
weather.sendCurrentWeather();
