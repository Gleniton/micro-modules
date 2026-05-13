const Joi = require('joi');

const createPaymentSchema = Joi.object({
  userId: Joi.string().required(),
  cardId: Joi.string().required(),
  amount: Joi.number().positive().max(50000).required(),
  currency: Joi.string().uppercase().length(3).valid('USD', 'EUR', 'BRL').required()
});

const refundPaymentSchema = Joi.object({
  amount: Joi.number().positive().optional()
});

const webhookSchema = Joi.object({
  event: Joi.string().required(),
  paymentId: Joi.string().required(),
  status: Joi.string().required()
});

const idParamSchema = Joi.object({
  id: Joi.string().required()
});

module.exports = { createPaymentSchema, refundPaymentSchema, webhookSchema, idParamSchema };
