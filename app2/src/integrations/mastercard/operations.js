const { ExternalError } = require('../../errors');

const createGateway = (client) => ({
  createPayment: async ({ cardId, amount, currency }) => {
    const payload = { cardId, amount: { currency, value: amount }, capture: true };
    try {
      const result = await client.post('/v1/payments', payload);
      return result.data;
    } catch (error) {
      throw new ExternalError('mastercard_rejected');
    }
  }
});

module.exports = createGateway;
