const crypto = require('crypto');
const { ValidationError } = require('../errors');

/**
 * Webhook signature verification middleware
 * Verifies the HMAC signature in the X-Mastercard-Webhook-Signature header
 * Secret is expected to be in process.env.MASTERCARD_WEBHOOK_SECRET
 */
const webhookSignatureMiddleware = (req, res, next) => {
  const signature = req.headers['x-mastercard-webhook-signature'];
  const webhookSecret = process.env.MASTERCARD_WEBHOOK_SECRET || 'default-secret-key';

  if (!signature) {
    throw new ValidationError('missing_webhook_signature');
  }

  // Calculate expected signature
  const payload = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');

  // Compare signatures (constant-time comparison to prevent timing attacks)
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw new ValidationError('invalid_webhook_signature');
  }

  next();
};

module.exports = webhookSignatureMiddleware;
