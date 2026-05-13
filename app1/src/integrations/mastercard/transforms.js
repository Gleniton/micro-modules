const toMastercardPayment = ({ cardId, amount, currency }) => ({
  cardId,
  amount: { currency, value: amount },
  capture: true
});

const fromMastercardPayment = (data) => ({
  mcId: data.id || null,
  status: data.status || 'unknown',
  raw: data
});

module.exports = { toMastercardPayment, fromMastercardPayment };
