// @domain:payment | @op:create | @needs:joi,mastercard | @side_effects:external
// @changed:2026-05-12 | @tokens:~120
const Joi = require('joi');
const { ok, fail } = require('../../shared/response');
const errors = require('../../shared/errors');
const { payments, users } = require('../../shared/store');
const { fetchCreatePayment } = require('../../integrations/mastercard/operations');
const { toMastercardPayment, fromMastercardPayment } = require('../../integrations/mastercard/transforms');

const createPaymentSchema = Joi.object({
  userId: Joi.string().required(),
  cardId: Joi.string().required(),
  amount: Joi.number().positive().max(50000).required(),
  currency: Joi.string().uppercase().length(3).valid('USD','EUR','BRL').required()
});

const businessRules = {
  getUser: (userId) => users.find((u) => u.id === userId),
  checkAmount: (amount) => amount <= 50000,
  calculateFee: (amount, currency) => {
    const rates = { USD: 0.029, EUR: 0.035, BRL: 0.049 };
    return Math.round((amount * (rates[currency] || 0.03)) * 100) / 100;
  },
  isFraud: ({ amount, currency }) => amount > 10000 || (currency !== 'USD' && amount > 5000)
};

const validateCreatePayment = (payload) => {
  const { error, value } = createPaymentSchema.validate(payload);
  if (error) return fail(errors.bad_req, 'invalid_payment_payload');
  if (!businessRules.checkAmount(value.amount)) return fail(errors.bad_req, 'amount_exceeds_limit');
  return ok(value);
};

const createPayment = async (payload) => {
  const valid = validateCreatePayment(payload);
  if (!valid.ok) return valid;
  const user = businessRules.getUser(valid.data.userId);
  if (!user) return fail(errors.not_found, 'user_not_found');
  const mcPayload = toMastercardPayment(valid.data);
  const mcResult = await fetchCreatePayment(mcPayload);
  if (!mcResult.ok) return fail(errors.mc_error, 'mastercard_rejected');
  const payment = {
    id: `p_${Date.now()}`,
    userId: valid.data.userId,
    cardId: valid.data.cardId,
    amount: valid.data.amount,
    currency: valid.data.currency,
    fee: businessRules.calculateFee(valid.data.amount, valid.data.currency),
    fraud: businessRules.isFraud(valid.data),
    status: 'captured',
    mastercard: fromMastercardPayment(mcResult.data),
    createdAt: new Date().toISOString()
  };
  payments.push(payment);
  return ok(payment);
};

// TEST:createPayment
// GIVEN: {userId:'u_1', cardId:'card_123', amount:100, currency:'USD'}
// THEN: returns {ok:true, data:{amount:100, status:'captured'}}

module.exports = createPayment;
