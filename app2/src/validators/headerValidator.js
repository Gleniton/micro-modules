const Joi = require('joi');

const commonHeaders = Joi.object({
  'x-request-id': Joi.string().optional(),
  authorization: Joi.string().optional()
}).unknown(true);

module.exports = { commonHeaders };
