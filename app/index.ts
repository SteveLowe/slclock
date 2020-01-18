import clock, { TickEvent } from "clock";
import { showCurrentTime } from "./time";

function handleTick(evt: TickEvent) {
  showCurrentTime(evt.date);
}

clock.granularity = "minutes";
clock.ontick = handleTick;
