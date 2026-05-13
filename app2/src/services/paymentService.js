const { NotFoundError, ConflictError, ValidationError } = require('../errors');
const paymentRules = require('../domain/paymentRules');

const createPaymentService = (paymentRepository, userRepository, mastercardGateway) => ({
  create: async (data) => {
    const user = await userRepository.findById(data.userId);
    if (!user) throw new NotFoundError('user_not_found');
    const mastercard = await mastercardGateway.createPayment(data);
    const payment = {
      id: `p_${Date.now()}`,
      ...data,
      status: 'captured',
      fee: paymentRules.calcFee(data.amount, data.currency),
      fraud: paymentRules.isFraud(data),
      mastercard,
      createdAt: new Date().toISOString()
    };
    return paymentRepository.create(payment);
  },
  refund: async (id, refundAmount = null) => {
    const payment = await paymentRepository.findById(id);
    if (!payment) throw new NotFoundError('payment_not_found');
    
    // Handle partial refunds
    if (refundAmount !== null) {
      if (refundAmount <= 0) throw new ValidationError('refund_amount_must_be_positive');
      if (refundAmount > payment.amount) throw new ValidationError('refund_amount_exceeds_payment');
      
      const refundedAmount = (payment.refundedAmount || 0) + refundAmount;
      if (refundedAmount > payment.amount) throw new ValidationError('total_refund_exceeds_payment');
      
      const newStatus = refundedAmount === payment.amount ? 'refunded' : 'partial_refund';
      return paymentRepository.update(id, {
        status: newStatus,
        refundedAmount: refundedAmount,
        refundedAt: new Date().toISOString(),
        refundHistory: [...(payment.refundHistory || []), { amount: refundAmount, timestamp: new Date().toISOString() }]
      });
    }
    
    // Full refund
    if (payment.status === 'refunded') throw new ConflictError('already_refunded');
    return paymentRepository.update(id, {
      status: 'refunded',
      refundedAmount: payment.amount,
      refundedAt: new Date().toISOString(),
      refundHistory: [...(payment.refundHistory || []), { amount: payment.amount, timestamp: new Date().toISOString() }]
    });
  },
  webhook: async (payload) => {
    const payment = await paymentRepository.findById(payload.paymentId);
    if (!payment) throw new NotFoundError('payment_not_found');
    return paymentRepository.update(payload.paymentId, {
      status: payload.status,
      webhookEvent: payload.event,
      updatedAt: new Date().toISOString()
    });
  }
});

module.exports = createPaymentService;
