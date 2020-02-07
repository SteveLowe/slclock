import "jest";
import { getHeartClass, getGoalClass } from "./thresholds";

// getHeartClass
test.each([
  [undefined, undefined, ""],
  [null, undefined, ""],
  [0, 0, ""],
  [60, 0, ""],
  [60, undefined, ""],
  [200, 0, ""],
  [200, undefined, ""],
  [undefined, 60, ""],
  [60, 60, ""],
  [50, 60, "red"],
  [97, 60, "amber"],
  [135, 60, "amber"],
  [136, 60, "red"],
  [200, 60, "red"]
])("getHearClass(%p, %p) -> %p", (heartRate, resting, expected) => {
  expect(getHeartClass(heartRate, resting)).toBe(expected);
});

//getGoalClass
test.each([
  [0, 0, "goalMet"],
  [100, 10000, ""],
  [1000, 10000, ""],
  [6999, 10000, ""],
  [7000, 10000, "goalNear"],
  [9000, 10000, "goalNear"],
  [9999, 10000, "goalNear"],
  [10000, 10000, "goalMet"],
  [15000, 10000, "goalMet"]
])("getGoalClass(%p, %p) -> %p", (metric, goal, expected) => {
  expect(getGoalClass(metric, goal)).toBe(expected);
});
