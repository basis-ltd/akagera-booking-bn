import moment from 'moment';
import { ValidationError } from './errors.helper';

export const isTimeBetween = (
  time: Date | string,
  startTime: Date | string,
  endTime: Date | string,
  timeFormat = 'HH:mm:ss'
) => {

  return moment(time).format(timeFormat) >= startTime && moment(time).format(timeFormat) <= endTime;
};
