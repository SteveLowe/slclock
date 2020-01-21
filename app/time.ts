import document from "document";
import * as util from "../common";

const timeLabel = document.getElementById("time");
const dateLabel = document.getElementById("date");

export function showCurrentTime(now: Date): void {
  if (!timeLabel || !dateLabel) {
    return;
  }

  const hours = util.zeroPad(now.getHours());
  const mins = util.zeroPad(now.getMinutes());
  timeLabel.text = `${hours}:${mins}`;

  const day = now.getDate();
  const weekDay = util.getWeekDay(now.getDay());
  const month = util.getMonth(now.getMonth());
  dateLabel.text = `${weekDay} ${day} ${month}`;
}
