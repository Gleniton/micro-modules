// @domain:payment | @op:webhook | @needs:joi,crypto | @side_effects:write
// @changed:2026-05-12 | @tokens:~55
const Joi = require('joi');
const crypto = require('crypto');
const { ok, fail } = require('../../shared/response');
const errors = require('../../shared/errors');
const { payments } = require('../../shared/store');

const webhookSchema = Joi.object({
  event: Joi.string().required(),
  paymentId: Joi.string().required(),
  status: Joi.string().required()
});

const verifySignature = (payload, signature, secret) => {
  const expectedSignature = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
};

const handleWebhook = async (payload, headers) => {
  const signature = headers['x-signature'];
  const secret = process.env.MASTERCARD_WEBHOOK_SECRET;
  if (!signature || !secret) return fail(errors.bad_req, 'missing_signature_or_secret');
  if (!verifySignature(payload, signature, secret)) return fail(errors.bad_req, 'invalid_signature');

  const { error, value } = webhookSchema.validate(payload);
  if (error) return fail(errors.bad_req, 'invalid_webhook_payload');
  const payment = payments.find((p) => p.id === value.paymentId);
  if (!payment) return fail(errors.not_found, 'payment_not_found');
  payment.status = value.status;
  payment.webhookEvent = value.event;
  payment.updatedAt = new Date().toISOString();
  return ok({ id: payment.id, status: payment.status });
};

// TEST:handleWebhook
// GIVEN: {event:'payment.updated', paymentId:'p_1', status:'settled'}
// THEN: returns {ok:true, data:{status:'settled'}}

module.exports = handleWebhook;
