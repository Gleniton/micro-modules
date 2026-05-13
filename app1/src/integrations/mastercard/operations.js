const client = require('./client');
const { fail, ok } = require('../../shared/response');
const errors = require('./errors');

const fetchCreateCard = async (payload) => {
  const res = await client.post('/v1/cards', payload);
  if (res.status !== 201 && res.status !== 200) return fail(errors.mc_error, 'mastercard_failed');
  return ok(res.data);
};

const fetchCreatePayment = async (payload) => {
  const res = await client.post('/v1/payments', payload);
  if (res.status !== 201 && res.status !== 200) return fail(errors.mc_error, 'mastercard_failed');
  return ok(res.data);
};

module.exports = { fetchCreateCard, fetchCreatePayment };
