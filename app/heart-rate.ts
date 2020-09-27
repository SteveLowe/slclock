import document from "document";
import { HeartRateSensor } from "heart-rate";
import { minuteHistory, dayHistory } from "user-activity";
import { getHeartClass } from "./thresholds";

let restingRate: number | undefined;

const currentLabel = document.getElementById("heart-rate-current");
const averageLabel = document.getElementById("heart-rate-average");

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
    .map((d) => d.averageHeartRate)
    .filter((d) => !!d) as number[];

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

let heartRateSensor: HeartRateSensor | undefined;
if (HeartRateSensor && currentLabel) {
  heartRateSensor = new HeartRateSensor();
  heartRateSensor?.addEventListener("reading", () => {
    const heartRate = heartRateSensor?.heartRate;
    currentLabel.text = heartRate?.toString() ?? "-";
    currentLabel.class = getHeartClass(heartRate, restingRate);
  });
}
function clearCurrentHeartRate(): void {
  if (currentLabel) {
    currentLabel.text = "-";
    currentLabel.class = "";
  }
}
export function startHeartRate(): void {
  heartRateSensor?.start();
}
export function stopHeartRate(): void {
  heartRateSensor?.stop();
  clearCurrentHeartRate();
}
