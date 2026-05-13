const express = require('express');
const rateLimitMiddleware = require('./middleware/rateLimitMiddleware');
const createRouter = require('./routes');

const createApp = (container) => {
  const app = express();
  app.use(express.json());
  app.use(rateLimitMiddleware);
  app.use(createRouter(container));

  app.use((error, req, res, next) => {
    const status = error.status || 500;
    return res.status(status).json({ error: { code: error.code || '5000', message: error.message || 'internal_error' } });
  });

  return app;
};

module.exports = createApp;
