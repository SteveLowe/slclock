import document from "document";
import { today, goals } from "user-activity";
import { getGoalClass } from "../common";

const stepLabel = document.getElementById("step-count");
const targetLabel = document.getElementById("step-target");

export function showStepCount(): void {
  if (!today || !stepLabel) {
    return;
  }

  const steps = today.adjusted.steps ?? 0;
  const stepGoal = goals.steps ?? 0;

  stepLabel.text = `${steps}`;

  if (targetLabel) {
    stepLabel.class = getGoalClass(steps, stepGoal);
    targetLabel.text = stepGoal > 0 ? ` / ${stepGoal}` : "";
  }
}
