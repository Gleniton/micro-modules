const { ValidationError } = require('../errors');

const validateRequest = ({ body, headers, params, query }) => async (req, res, next) => {
  try {
    const validated = {};

    if (headers) {
      const { error, value } = headers.validate(req.headers, {
        allowUnknown: true,
        stripUnknown: true,
        abortEarly: false
      });
      if (error) throw new ValidationError('invalid_headers');
      validated.headers = value;
    }

    if (params) {
      const { error, value } = params.validate(req.params, {
        allowUnknown: true,
        stripUnknown: true,
        abortEarly: false
      });
      if (error) throw new ValidationError('invalid_params');
      validated.params = value;
    }

    if (query) {
      const { error, value } = query.validate(req.query, {
        allowUnknown: true,
        stripUnknown: true,
        abortEarly: false
      });
      if (error) throw new ValidationError('invalid_query');
      validated.query = value;
    }

    if (body) {
      const { error, value } = body.validate(req.body, {
        allowUnknown: false,
        stripUnknown: true,
        abortEarly: false
      });
      if (error) throw new ValidationError('invalid_body');
      validated.body = value;
    }

    req.validated = validated;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = validateRequest;
