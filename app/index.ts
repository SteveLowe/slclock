import clock, { TickEvent } from "clock";
import { showCurrentTime } from "./time";
import {
  startHeartRate,
  stopHeartRate,
  showHeartRateAverage
} from "./heart-rate";
import { showStepCount } from "./steps";
import { showCalories } from "./calories";
import { display } from "display";
import { updateWeather } from "./weather";

let currentTime = new Date();

function updateDisplay(): void {
  showCurrentTime(currentTime);
  showHeartRateAverage();
  showStepCount();
  showCalories();
}

function handleTick(evt: TickEvent): void {
  currentTime = evt.date;
  updateWeather();
  if (display.on) {
    updateDisplay();
  }
}

display.addEventListener("change", () => {
  if (display.on) {
    startHeartRate();
    updateDisplay();
  } else {
    stopHeartRate();
  }
});

clock.granularity = "minutes";
clock.ontick = handleTick;
startHeartRate();
