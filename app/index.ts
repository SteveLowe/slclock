import clock, { TickEvent } from "clock";
import { showCurrentTime } from "./time";
import { startHeartRate, showHeartMinute } from "./heart-rate";
import { showStepCount } from "./steps";
import { showCalories } from "./calories";

function handleTick(evt: TickEvent): void {
  showCurrentTime(evt.date);
  showHeartMinute();
  showStepCount();
  showCalories();
}

clock.granularity = "minutes";
clock.ontick = handleTick;
startHeartRate();
