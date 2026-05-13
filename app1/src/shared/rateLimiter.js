// @shared | @util:rateLimiter | @needs:none | @side_effects:none
// @changed:2026-05-12 | @tokens:~30
const rateLimitStore = new Map();

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }

  const requests = rateLimitStore.get(ip);
  // Remove old requests outside the window
  const validRequests = requests.filter(time => now - time < windowMs);
  rateLimitStore.set(ip, validRequests);

  if (validRequests.length >= maxRequests) {
    return res.status(429).json({ ok: false, err: { code: '429', message: 'Too many requests' } });
  }

  validRequests.push(now);
  next();
};

module.exports = rateLimiter;