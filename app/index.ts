import clock, { TickEvent } from "clock";
import { showCurrentTime } from "./time";
import { startHeartRate, showHeartRateAverage } from "./heart-rate";
import { showStepCount } from "./steps";
import { showCalories } from "./calories";

function handleTick(evt: TickEvent): void {
  showCurrentTime(evt.date);
  showHeartRateAverage();
  showStepCount();
  showCalories();
}

clock.granularity = "minutes";
clock.ontick = handleTick;
startHeartRate();
