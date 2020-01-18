import clock from "clock";
import document from "document";
import * as util from "../utils";

// Update the clock every minute
clock.granularity = "minutes";

const timeLabel = document.getElementById("time");
const dateLabel = document.getElementById("date");

// Update the screen every minute
clock.ontick = evt => {
  let today = evt.date;

  const hours = util.zeroPad(today.getHours());
  const mins = util.zeroPad(today.getMinutes());
  timeLabel.text = `${hours}:${mins}`;

  const day = today.getDate();
  const weekDay = util.getWeekDay(today.getDay());
  const month = util.getMonth(today.getMonth());
  dateLabel.text = `${weekDay} ${day} ${month}`;
};
