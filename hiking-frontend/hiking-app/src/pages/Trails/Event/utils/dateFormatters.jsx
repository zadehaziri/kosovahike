import moment from "moment";

export const formatDate = ({ date, time }) => {
  const times = time.split(":");
  const hours = parseInt(times[0]);
  const minutes = parseInt(times[1]);
  const currentDate = new Date(date);
  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);

  return currentDate;
};

export const parseDateInHoursAndMinutes = (date) => {
  const currentDate = new Date(date);

  let hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const amOrPm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = `${hours}:${
    minutes < 10 ? "0" + minutes : minutes
  } ${amOrPm}`;

  return { formattedDate, formattedTime };
};

//NEW

export const carendarUnits = (currentDate) => {
  const [months, hours, days] = moment(currentDate)
    .format("MMMM HH dddd")
    .split(" ");

  return {
    months,
    hours,
    days,
  };
};

export const calculateRemainingDateUnits = (currentDate) => {
  const now = moment();

  // Future moment
  // eslint-disable-next-line no-undef
  const endDateTime = moment(currentDate);

  // Calculate difference in seconds
  const totalSeconds = endDateTime.diff(now, "seconds");
  const days = Math.floor(totalSeconds / (24 * 3600)); // Total seconds in a day
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600); // Remaining seconds converted to hours
  const minutes = Math.floor((totalSeconds % 3600) / 60); // Remaining seconds converted to minutes
  const seconds = totalSeconds % 60; // Remaining seconds

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};
