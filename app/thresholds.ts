export function getHeartClass(
  heartRate: number | null | undefined,
  resting: number | undefined
): string {
  if (!heartRate || !resting) {
    return "";
  }
  if (heartRate < resting * 0.9) {
    return "red";
  }
  if (heartRate > resting * 2.25) {
    return "red";
  }
  if (heartRate > resting * 1.6) {
    return "amber";
  }
  return "";
}

export function getGoalClass(metric: number, goal: number): string {
  if (metric >= goal) {
    return "goalMet";
  }
  if (metric >= goal * 0.7) {
    return "goalNear";
  }

  return "";
}
