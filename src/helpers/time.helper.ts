import moment from 'moment';

export const isTimeBetween = (
  time: Date,
  startTime: Date | string,
  endTime: Date | string,
  timeFormat = 'HH:mm:ss'
) => {
  const timeToCheck = moment(time).format(timeFormat);

  const startTimeToCheck = moment(startTime, timeFormat);
  const endTimeToCheck = moment(endTime, timeFormat);

  const timeMomentToCheck = moment(timeToCheck, timeFormat);
  return timeMomentToCheck.isBetween(startTimeToCheck, endTimeToCheck, null, '[)');
};
