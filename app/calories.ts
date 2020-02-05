import document from "document";
import { today, goals } from "user-activity";
import { getGoalClass } from "./thresholds";

const caloriesLabel = document.getElementById("calories-count");
const targetLabel = document.getElementById("calories-target");

export function showCalories(): void {
  if (!today || !caloriesLabel) {
    return;
  }

  const calories = today.adjusted.calories ?? 0;
  const caloriesGoal = goals.calories ?? 0;

  caloriesLabel.text = `${calories}`;

  if (targetLabel) {
    targetLabel.text = caloriesGoal > 0 ? `${caloriesGoal}` : "";
    caloriesLabel.class = getGoalClass(calories, caloriesGoal);
  }
}
