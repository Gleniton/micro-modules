class AppError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

class ValidationError extends AppError {
  constructor(message = 'invalid_payload') {
    super('4001', message, 400);
  }
}

class ConflictError extends AppError {
  constructor(message = 'conflict') {
    super('4002', message, 409);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'not_found') {
    super('4004', message, 404);
  }
}

class ExternalError extends AppError {
  constructor(message = 'external_service_error') {
    super('5001', message, 502);
  }
}

module.exports = { AppError, ValidationError, ConflictError, NotFoundError, ExternalError };
