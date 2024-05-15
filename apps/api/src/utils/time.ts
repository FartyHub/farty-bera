/* eslint-disable no-magic-numbers */
export function forwardDateBySeconds(seconds = 1) {
  const forwardedDate = new Date();

  forwardedDate.setTime(forwardedDate.getTime() + seconds * 1000);

  return forwardedDate;
}

export function forwardDateByMins(mins = 1) {
  const forwardedDate = new Date();

  forwardedDate.setHours(forwardedDate.getMinutes() + mins);

  return forwardedDate;
}

export function forwardDateByHours(hours = 8, selectedDate = new Date()) {
  const forwardedDate = new Date(selectedDate.getTime());

  forwardedDate.setHours(forwardedDate.getHours() + hours);

  return forwardedDate;
}

export function forwardDateByDays(days = 1) {
  const forwardedDate = new Date();

  forwardedDate.setDate(forwardedDate.getDate() + days);

  return forwardedDate;
}

export function forwardDateByMonths(months = 1) {
  const forwardedDate = new Date();

  forwardedDate.setMonth(forwardedDate.getMonth() + months);

  return forwardedDate;
}
