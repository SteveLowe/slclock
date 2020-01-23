import document from "document";
import { HeartRateSensor } from "heart-rate";
import { minuteHistory, dayHistory } from "user-activity";

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
    showHeartRateCurrent();
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

function getAverageHeartRates(minutes: number): [number?, number?] {
  if (!minuteHistory) {
    return [undefined, undefined];
  }

  const data = minuteHistory.query({ limit: minutes });
  if (data.length == 0) {
    return [undefined, undefined];
  }

  const oneMinAverage = data[0].averageHeartRate as number | undefined;
  const validHeartRates = data
    .map(d => d.averageHeartRate)
    .filter(d => !!d) as number[];

  const fullAverage = Math.floor(
    validHeartRates.reduce((acc, cur) => acc + cur, 0) / validHeartRates.length
  );

  return [oneMinAverage, fullAverage];
}

function getRestingHeartRate(): number | undefined {
  if (!dayHistory) {
    return undefined;
  }
  const [day] = dayHistory.query({ limit: 1 });
  return day?.restingHeartRate as number | undefined;
}

export function showHeartRateAverage(): void {
  if (!averageLabel) {
    return;
  }

  const [oneMin, fifteenMins] = getAverageHeartRates(15);
  restingRate = getRestingHeartRate();

  let averageMessage = "";
  if (oneMin || fifteenMins) {
    averageMessage = `${oneMin ?? "-"}, ${fifteenMins ?? "-"}`;
  }
  if (restingRate) {
    averageMessage = averageMessage
      ? `${averageMessage} | ${restingRate}`
      : `${restingRate}`;
  }

  averageLabel.text = averageMessage;
}
