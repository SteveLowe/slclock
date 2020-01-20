import document from "document";
import { today, goals } from "user-activity";

const caloriesLabel = document.getElementById("calories-count");
const targetLabel = document.getElementById("calories-target");

export function showCalories(): void {
  if (!today) {
    return;
  }

  if (caloriesLabel) {
    const calories = today.adjusted.calories;
    caloriesLabel.text = `${calories ?? 0}`;
  }

  if (targetLabel) {
    const caloriesGoal = goals.calories;
    targetLabel.text = `/ ${caloriesGoal ?? "?"}`;
  }
}
