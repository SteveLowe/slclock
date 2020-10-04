import document from "document";
import { today, goals } from "user-activity";
import { getGoalClass } from "./thresholds";

const stepLabel = document.getElementById("step-count");
const targetLabel = document.getElementById("step-target");
const distanceLabel = document.getElementById("distance-count");

export function showStepCount(): void {
  if (!today || !stepLabel || !distanceLabel) {
    return;
  }

  const steps = today.adjusted.steps ?? 0;
  const stepGoal = goals.steps ?? 0;
  const stepGoalK =
    stepGoal >= 10000 ? stepGoal / 1000 : (stepGoal / 1000.0).toFixed(1);
  const distance = today.adjusted.distance ?? 0;
  const distanceKm =
    distance >= 10000 ? distance / 1000 : (distance / 1000.0).toFixed(1);

  stepLabel.text = `${steps}`;
  distanceLabel.text = `${distanceKm}km`;

  if (targetLabel) {
    targetLabel.text = stepGoal > 0 ? `${stepGoalK}k` : "";
    stepLabel.class = getGoalClass(steps, stepGoal);
  }
}
