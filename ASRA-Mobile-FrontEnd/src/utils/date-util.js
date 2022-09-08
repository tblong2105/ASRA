import moment from "moment";
import { FORMAT_DATE } from "../constants";
export const formatDate = (date) => {
  return moment(date).format("DD-MMM-YYYY");
};

export const utcToVNTime = (date) => {
  return moment.utc(date).utcOffset("+14:00").format("DD-MM-YYYY");
};

export const diffBetweenDate = (createRoomDate) => {
  let today = new moment();
  let formatCreateRoomDate = moment(createRoomDate).format(
    FORMAT_DATE.YYYY_MM_DD_HH_mm_ss
  );
  let duration = moment.duration(today.diff(formatCreateRoomDate));
  let result = "";
  let years = duration.asYears();
  let months = duration.asMonths();
  let weeks = duration.asWeeks();
  let days = duration.asDays();
  let hours = duration.asHours();
  let minutes = duration.asMinutes();
  switch (true) {
    case minutes <= 60:
      result = `${Math.round(minutes)} minutes ago`;
      break;
    case hours <= 24:
      result = `${Math.round(hours)} hours ago`;
      break;
    case days <= 365:
      result = `${Math.round(days)} days ago`;
      break;
    case weeks <= 52:
      result = `${Math.round(weeks)} weeks ago`;
      break;
    case months <= 12:
      result = `${Math.round(months)} months ago`;
      break;
    case years >= 1:
      result = `${Math.round(years)} years ago`;
      break;
    default:
      break;
  }

  return result;
};
