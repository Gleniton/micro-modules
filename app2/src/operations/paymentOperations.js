const paymentTransformer = require('../transformers/paymentTransformer');

const createPaymentOperations = (paymentService) => ({
  create: async (payload) => {
    const payment = await paymentService.create(payload);
    return paymentTransformer.toResponse(payment);
  },
  refund: async (id, refundData) => {
    const refundAmount = refundData && refundData.amount ? refundData.amount : null;
    const payment = await paymentService.refund(id, refundAmount);
    return paymentTransformer.toResponse(payment);
  },
  webhook: async (payload) => {
    const payment = await paymentService.webhook(payload);
    return paymentTransformer.toResponse(payment);
  }
});

module.exports = createPaymentOperations;
