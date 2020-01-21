import document from "document";
import { HeartRateSensor } from "heart-rate";
import {
  minuteHistory,
  dayHistory,
  ActivityHistoryRecord
} from "user-activity";

let heartRateSensor: HeartRateSensor | undefined;

const currentLabel = document.getElementById("heart-rate-current");
const averageLabel = document.getElementById("heart-rate-average");

function showHeartRateCurrent(): void {
  if (!currentLabel) {
    return;
  }

  const heartRate = heartRateSensor?.heartRate;
  currentLabel.text = heartRate?.toString() ?? "n/a";
}

export function startHeartRate(): void {
  if (HeartRateSensor && !heartRateSensor) {
    // heart rate is available
    heartRateSensor = new HeartRateSensor();
    heartRateSensor.addEventListener("reading", showHeartRateCurrent);
    heartRateSensor.start();
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
  const resting = getRestingHeartRate();

  let averageMessage = "";
  if (averages) {
    const [oneMin, fifteenMins] = averages;
    averageMessage = `${oneMin}, ${fifteenMins}`;
  }
  if (resting) {
    averageMessage = averageMessage
      ? `${averageMessage}, ${resting}`
      : `${resting}`;
  }

  averageLabel.text = averageMessage;
}
