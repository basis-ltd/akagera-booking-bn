import Joi from 'joi';
import { COUNTRIES } from '../constants/countries.constants';
import { ValidationError } from './errors.helper';
import moment, { Moment } from 'moment';

// VALIDATE EMAIL
export const validateEmail = (email: string) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  return schema.validate({ email });
};

// VALIDATE COUNTRY
export const validateCountry = (country: string) => {
  const countryExists = COUNTRIES.find((c) => c.code === country.toUpperCase());

  if (!countryExists) {
    return false;
  }

  return true;
};

// VALIDATE UUID
export const validateUuid = (uuid: string) => {
  // CHECK IF UUID IS PROVIDED
  if (!uuid) {
    throw new ValidationError('ID is required');
  }

  const schema = Joi.object({
    uuid: Joi.string().uuid().required(),
  });

  return schema.validate({ uuid });
};

// VALIDATE START AND END TIME
export const validateStartAndEndTime = (
  startTime: string | Moment,
  endTime: string | Moment
) => {
  // IF START TIME IS NOT PROVIDED
  if (!startTime) {
    throw new ValidationError('Start Time is required');
  }

  // IF START TIME IS INVALID
  if (!moment(startTime, 'HH:mm:ss', true).isValid()) {
    throw new ValidationError('Invalid Start Time');
  }

  // VALIDATE END TIME IF PROVIDED
  if (endTime) {
    // IF END TIME IS INVALID
    if (!moment(endTime, 'HH:mm:ss', true).isValid()) {
      throw new ValidationError('Invalid End Time');
    }

  }
};
