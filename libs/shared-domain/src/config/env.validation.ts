import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  ADMIN_PORT: Joi.number().default(3000),
  CONSUMER_PORT: Joi.number().default(3001),

  JWT_SECRET: Joi.string().default('dev-secret'),

  DATABASE_URL: Joi.string().optional(),
});
