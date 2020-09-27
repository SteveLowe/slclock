import document from "document";
import { today, goals } from "user-activity";
import { getGoalClass } from "./thresholds";

const stepLabel = document.getElementById("active-minutes-count");

export function showActiveMinutesCount(): void {
  if (!today || !stepLabel) {
    return;
  }

  const activeZoneMinutes = today.adjusted.activeZoneMinutes?.total ?? 0;
  const stepGoal = goals.activeZoneMinutes?.total ?? 0;

  stepLabel.text = `${activeZoneMinutes}`;
  stepLabel.class = getGoalClass(activeZoneMinutes, stepGoal);
}
