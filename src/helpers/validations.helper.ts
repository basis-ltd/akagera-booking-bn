import Joi from 'joi';
import { COUNTRIES } from '../constants/countries.constant';

export const validateEmail = (email: string) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  return schema.validate({ email });
};

export const validateCountry = (country: string) => {
  const countryExists = COUNTRIES.find((c) => c.code === country.toUpperCase());

  if (!countryExists) {
    return false;
  }

  return true;
};
