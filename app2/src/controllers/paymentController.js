const createPaymentController = (paymentOperations) => ({
  create: async (req, res) => {
    try {
      const payment = await paymentOperations.create(req.validated.body);
      return res.status(201).json(payment);
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({ error: { code: error.code || '5000', message: error.message || 'internal_error' } });
    }
  },
  refund: async (req, res) => {
    try {
      const payment = await paymentOperations.refund(req.validated.params.id, req.validated.body);
      return res.status(200).json(payment);
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({ error: { code: error.code || '5000', message: error.message || 'internal_error' } });
    }
  },
  webhook: async (req, res) => {
    try {
      const payment = await paymentOperations.webhook(req.validated.body);
      return res.status(200).json(payment);
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({ error: { code: error.code || '5000', message: error.message || 'internal_error' } });
    }
  }
});

module.exports = createPaymentController;
