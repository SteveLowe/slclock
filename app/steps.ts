import document from "document";
import { today, goals } from "user-activity";

const stepLabel = document.getElementById("step-count");
const targetLabel = document.getElementById("step-target");

export function showStepCount(): void {
  if (!today) {
    return;
  }

  if (stepLabel) {
    const steps = today.adjusted.steps;
    stepLabel.text = `${steps ?? 0}`;
  }

  if (targetLabel) {
    const stepGoal = goals.steps;
    targetLabel.text = ` / ${stepGoal ?? "?"}`;
  }
}
