import document from "document";
import { HeartRateSensor } from "heart-rate";
import {
  minuteHistory,
  dayHistory,
  ActivityHistory,
  ActivityHistoryRecord
} from "user-activity";

let heartRateSensor: HeartRateSensor | undefined;

const currentLabel = document.getElementById("heart-rate-current");
const averageLabel = document.getElementById("heart-rate-average");

export function startHeartRate(): void {
  if (HeartRateSensor && !heartRateSensor) {
    // heart rate is available
    heartRateSensor = new HeartRateSensor();
    heartRateSensor.addEventListener("reading", showHeartCurrent);
    heartRateSensor.start();
  }
}

export function showHeartMinute(): void {
  const minute = getHeartPeriod(minuteHistory, 1);
  const fiveMins = getHeartPeriod(minuteHistory, 5);
  const day = getHeartPeriod(dayHistory, 1);

  averageLabel.text = `${minute ?? " "}, ${fiveMins ?? " "}, ${day ?? " "}`;
}

function showHeartCurrent() {
  const heartRate = heartRateSensor?.heartRate;
  currentLabel.text = heartRate?.toString() ?? "n/a";
}

function getHeartPeriod(
  period: ActivityHistory,
  count: number
): number | undefined {
  if (!period) {
    return undefined;
  }

  const data = period.query({ limit: count });
  if (data.length == 0) {
    return undefined;
  }

  if (data.length == 1) {
    const heartRate = data[0].averageHeartRate;
    if (heartRate) {
      return heartRate;
    }
    return undefined;
  }

  const average = data.reduce(sumHeartRate, 0) / data.length;
  return average;
}

function sumHeartRate(
  accumulator: number,
  current: ActivityHistoryRecord
): number {
  if (current.averageHeartRate) {
    return current.averageHeartRate + accumulator;
  }
  return accumulator;
}
