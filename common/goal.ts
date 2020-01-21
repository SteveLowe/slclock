export function getGoalClass(metric: number, goal: number): string {
  if (metric == 0 || goal == 0) {
    return "";
  }
  if (metric >= goal) {
    return "goalMet";
  }
  if (metric >= goal * 0.7) {
    return "goalNear";
  }
  return "goalNotMet";
}
