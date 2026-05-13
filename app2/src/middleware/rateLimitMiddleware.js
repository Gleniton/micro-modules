const { ValidationError } = require('../errors');

/**
 * Rate limiting middleware
 * Limits requests per IP address
 * Configuration:
 * - windowMs: time window in milliseconds (default: 1 minute)
 * - maxRequests: maximum requests per window (default: 100)
 */

class RateLimiter {
  constructor(windowMs = 60000, maxRequests = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.requests = new Map();
  }

  middleware() {
    return (req, res, next) => {
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      const now = Date.now();

      // Initialize or get existing record for this IP
      if (!this.requests.has(ip)) {
        this.requests.set(ip, []);
      }

      const timestamps = this.requests.get(ip);

      // Remove timestamps outside the current window
      const validTimestamps = timestamps.filter(t => now - t < this.windowMs);

      if (validTimestamps.length >= this.maxRequests) {
        throw new ValidationError('rate_limit_exceeded');
      }

      // Add current request timestamp
      validTimestamps.push(now);
      this.requests.set(ip, validTimestamps);

      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', this.maxRequests - validTimestamps.length);
      res.setHeader('X-RateLimit-Reset', new Date(now + this.windowMs).toISOString());

      // Clean up old entries periodically
      if (Math.random() < 0.01) {
        for (const [key, times] of this.requests.entries()) {
          const validTimes = times.filter(t => now - t < this.windowMs);
          if (validTimes.length === 0) {
            this.requests.delete(key);
          } else {
            this.requests.set(key, validTimes);
          }
        }
      }

      next();
    };
  }
}

const rateLimiter = new RateLimiter(60000, 100); // 100 requests per minute

module.exports = rateLimiter.middleware();
