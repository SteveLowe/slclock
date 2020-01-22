const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export function getWeekDay(weekDayNum: number): string {
  return weekDay[weekDayNum];
}

export function getMonth(monthNum: number): string {
  return months[monthNum];
}

/**
 * gets the age of the given date, in milliseconds
 * @param date
 */
export function getAge(date: Date): number {
  const now = new Date();
  return now.getTime() - date.getTime();
}

export function isRecent(
  date: Date | string | undefined,
  thresholdSeconds: number
): boolean {
  if (!date) {
    return false;
  }
  if (typeof date === "string") {
    date = new Date(date);
  }
  const thresholdMs = thresholdSeconds * 1000;
  const ageMs = getAge(date);
  const isRecent = ageMs < thresholdMs;
  return isRecent;
}
