const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('standard', 'admin').default('standard')
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email(),
  role: Joi.string().valid('standard', 'admin')
}).min(1);

const idParamSchema = Joi.object({
  id: Joi.string().required()
});

module.exports = { createUserSchema, updateUserSchema, idParamSchema };
