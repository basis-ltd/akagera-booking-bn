import Joi from 'joi';
import { COUNTRIES } from '../constants/countries.constant';
import { ValidationError } from './errors.helper';

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
