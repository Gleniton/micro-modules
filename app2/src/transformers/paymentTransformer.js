const toResponse = (payment) => ({
  id: payment.id,
  userId: payment.userId,
  cardId: payment.cardId,
  amount: payment.amount,
  currency: payment.currency,
  fee: payment.fee,
  fraud: payment.fraud,
  status: payment.status,
  mastercard: payment.mastercard,
  createdAt: payment.createdAt,
  updatedAt: payment.updatedAt || payment.refundedAt || null
});

module.exports = { toResponse };
