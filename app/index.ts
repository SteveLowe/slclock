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

let currentTime = new Date();

function updateDisplay(): void {
  showCurrentTime(currentTime);
  showHeartRateAverage();
  showStepCount();
  showCalories();
}

function handleTick(evt: TickEvent): void {
  currentTime = evt.date;
  if (display.on) {
    updateDisplay();
  }
}

display.addEventListener("change", () => {
  if (display.on) {
    updateDisplay();
    startHeartRate();
  } else {
    stopHeartRate();
  }
});

clock.granularity = "minutes";
clock.ontick = handleTick;
startHeartRate();
