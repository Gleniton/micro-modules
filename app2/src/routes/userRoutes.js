const express = require('express');
const validateRequest = require('../middleware/validateRequest');
const userValidator = require('../validators/userValidator');
const headerValidator = require('../validators/headerValidator');

const createUserRoutes = (controller) => {
  const router = express.Router();
  router.post(
    '/',
    validateRequest({ headers: headerValidator.commonHeaders, body: userValidator.createUserSchema }),
    controller.create
  );
  router.get(
    '/',
    validateRequest({ headers: headerValidator.commonHeaders }),
    controller.list
  );
  router.get(
    '/:id',
    validateRequest({ headers: headerValidator.commonHeaders, params: userValidator.idParamSchema }),
    controller.read
  );
  router.put(
    '/:id',
    validateRequest({
      headers: headerValidator.commonHeaders,
      params: userValidator.idParamSchema,
      body: userValidator.updateUserSchema
    }),
    controller.update
  );
  router.delete(
    '/:id',
    validateRequest({ headers: headerValidator.commonHeaders, params: userValidator.idParamSchema }),
    controller.delete
  );
  return router;
};

module.exports = createUserRoutes;
