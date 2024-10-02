import * as Joi from 'joi';
export default Joi.object({
  ENV: Joi.string().valid('development', 'production', 'staging').required(),
  PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().required(),
  APP_URL: Joi.string().required(),
  GLOBAL_PREFIX: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
});
