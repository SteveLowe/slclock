import clock, { TickEvent } from "clock";
import { showCurrentTime } from "./time";
import { startHeartRate, showHeartMinute } from "./heart-rate";

function handleTick(evt: TickEvent) {
  showCurrentTime(evt.date);
  showHeartMinute();
}

clock.granularity = "minutes";
clock.ontick = handleTick;
startHeartRate();
