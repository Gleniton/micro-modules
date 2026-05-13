// @domain:payment | @op:refund | @needs:none | @side_effects:write
// @changed:2026-05-12 | @tokens:~55
const { ok, fail } = require('../../shared/response');
const errors = require('../../shared/errors');
const { payments } = require('../../shared/store');

const refundPayment = async (id, amount) => {
  const payment = payments.find((p) => p.id === id);
  if (!payment) return fail(errors.not_found, 'payment_not_found');
  if (payment.status === 'refunded') return fail(errors.conflict, 'already_refunded');

  const refundAmount = amount || payment.amount;
  if (refundAmount > payment.amount) return fail(errors.bad_req, 'refund_amount_exceeds_payment');
  if (refundAmount <= 0) return fail(errors.bad_req, 'invalid_refund_amount');

  // For simplicity, if partial, mark as partially_refunded, else refunded
  if (refundAmount < payment.amount) {
    payment.status = 'partially_refunded';
    payment.refundedAmount = (payment.refundedAmount || 0) + refundAmount;
  } else {
    payment.status = 'refunded';
    payment.refundedAmount = payment.amount;
  }
  payment.refundedAt = new Date().toISOString();
  return ok({ id, status: payment.status, refundedAmount: payment.refundedAmount });
};

// TEST:refundPayment
// GIVEN: existing payment id
// THEN: returns {ok:true, data:{status:'refunded'}}

// TEST:refundPayment partial
// GIVEN: existing payment id, amount < payment.amount
// THEN: returns {ok:true, data:{status:'partially_refunded', refundedAmount}}

module.exports = refundPayment;
