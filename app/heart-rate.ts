import document from "document";
import { HeartRateSensor } from "heart-rate";
import {
  minuteHistory,
  dayHistory,
  ActivityHistoryRecord
} from "user-activity";

let heartRateSensor: HeartRateSensor | undefined;
let restingRate: number | undefined;

const currentLabel = document.getElementById("heart-rate-current");
const averageLabel = document.getElementById("heart-rate-average");

function getHeartClass(heartRate: number, resting: number): string {
  if (heartRate < resting * 0.95) {
    return "red";
  }
  if (heartRate > resting * 2.0) {
    return "red";
  }
  if (heartRate > resting * 1.5) {
    return "amber";
  }
  return "";
}

function showHeartRateCurrent(): void {
  if (!currentLabel) {
    return;
  }

  const heartRate = heartRateSensor?.heartRate;
  currentLabel.text = heartRate?.toString() ?? "-";
  if (heartRate && restingRate) {
    currentLabel.class = getHeartClass(heartRate, restingRate);
  } else {
    currentLabel.class = "";
  }
}

export function startHeartRate(): void {
  if (HeartRateSensor && !heartRateSensor) {
    // heart rate is available
    heartRateSensor = new HeartRateSensor();
    heartRateSensor.addEventListener("reading", showHeartRateCurrent);
    heartRateSensor.start();
  }
}
export function stopHeartRate(): void {
  if (HeartRateSensor && heartRateSensor) {
    heartRateSensor.removeEventListener("reading", showHeartRateCurrent);
    heartRateSensor.stop();
    heartRateSensor = undefined;
    showHeartRateCurrent();
  }
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

function getAverageHeartRates(): [number, number] | undefined {
  if (!minuteHistory) {
    return undefined;
  }

  const data = minuteHistory.query({ limit: 15 });
  if (data.length == 0) {
    return undefined;
  }

  const oneMin = data[0].averageHeartRate;
  if (!oneMin) {
    return undefined;
  }
  const fifteenMins = Math.floor(data.reduce(sumHeartRate, 0) / data.length);

  return [oneMin, fifteenMins];
}

function getRestingHeartRate(): number | undefined {
  if (!dayHistory) {
    return undefined;
  }
  const [day] = dayHistory.query({ limit: 1 });
  if (!day || !day.restingHeartRate) {
    return undefined;
  }
  return day.restingHeartRate;
}

export function showHeartRateAverage(): void {
  if (!averageLabel) {
    return;
  }

  const averages = getAverageHeartRates();
  restingRate = getRestingHeartRate();

  let averageMessage = "";
  if (averages) {
    const [oneMin, fifteenMins] = averages;
    averageMessage = `${oneMin}, ${fifteenMins}`;
  }
  if (restingRate) {
    averageMessage = averageMessage
      ? `${averageMessage}, ${restingRate}`
      : `${restingRate}`;
  }

  averageLabel.text = averageMessage;
}
