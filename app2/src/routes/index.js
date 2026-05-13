const express = require('express');
const userRoutes = require('./userRoutes');
const paymentRoutes = require('./paymentRoutes');

const createRouter = (container) => {
  const router = express.Router();
  router.use('/users', userRoutes(container.userController));
  router.use('/', paymentRoutes(container.paymentController));
  return router;
};

module.exports = createRouter;
