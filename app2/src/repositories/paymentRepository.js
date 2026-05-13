const { payments } = require('./inMemoryStore');

const createPaymentRepository = () => ({
  create: async (payment) => { payments.push(payment); return payment; },
  findById: async (id) => payments.find((p) => p.id === id) || null,
  update: async (id, updates) => {
    const payment = payments.find((p) => p.id === id);
    if (!payment) return null;
    Object.assign(payment, updates);
    return payment;
  }
});

module.exports = createPaymentRepository;
