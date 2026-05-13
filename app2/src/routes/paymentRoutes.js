const express = require('express');
const validateRequest = require('../middleware/validateRequest');
const webhookSignatureMiddleware = require('../middleware/webhookSignatureMiddleware');
const paymentValidator = require('../validators/paymentValidator');
const headerValidator = require('../validators/headerValidator');

const createPaymentRoutes = (controller) => {
  const router = express.Router();
  router.post(
    '/payments',
    validateRequest({ headers: headerValidator.commonHeaders, body: paymentValidator.createPaymentSchema }),
    controller.create
  );
  router.post(
    '/payments/:id/refund',
    validateRequest({ headers: headerValidator.commonHeaders, params: paymentValidator.idParamSchema, body: paymentValidator.refundPaymentSchema }),
    controller.refund
  );
  router.post(
    '/webhooks/mastercard',
    webhookSignatureMiddleware,
    validateRequest({ headers: headerValidator.commonHeaders, body: paymentValidator.webhookSchema }),
    controller.webhook
  );
  return router;
};

module.exports = createPaymentRoutes;
