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
