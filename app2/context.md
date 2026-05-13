# System Context for AI

## Purpose
This file defines the conventions and constraints for `app2` so AI can create and modify features consistently and efficiently.
Focus on clean architecture with separation of concerns, dependency injection, and maintainability. Use layered design for scalability and testability.

## Architecture
- Clean architecture with layered separation:
  - Routes: HTTP routing and middleware integration.
  - Controllers: Request/response handling and action orchestration.
  - Operations: Business logic orchestration and data transformation.
  - Services: Domain business rules and external interactions.
  - Repositories: Data persistence abstraction.
  - Transformers: Data mapping and formatting.
  - Middleware: Cross-cutting concerns like validation and error handling.
  - Errors: Custom exception classes for domain errors.
- Dependency injection via container for testability and decoupling.
- Exception-based error flow: throw domain errors, catch in middleware for HTTP responses.
- Each layer has a single responsibility; avoid mixing concerns.

## File and naming conventions
- Use `createX`, `getX`, `updateX`, `deleteX`, `listX` for CRUD operations in services/repositories.
- Use `fetchX` or `callX` for external HTTP calls in services or gateways.
- Use `validateX` for schema validation in validators.
- Use `calcX` for pure computations in domain rules.
- Use `mapX`, `buildX`, `formatX` for transformation helpers.
- Use factory functions like `createXService` for dependency injection.
- Controllers: explicit action methods (create, list, read, update, delete).
- Routes: `createXRoutes` factory functions.

## Response contract
- Controllers return data directly; errors are thrown as exceptions.
- Successful responses: JSON data with appropriate HTTP status (200, 201, etc.).
- Error responses: handled by error middleware, returning JSON with error details.
- Use standard HTTP status codes; domain errors map to appropriate codes.

## Error codes and exceptions
- Custom error classes in `src/errors/`:
  - `NotFoundError`: 404 for missing resources.
  - `ConflictError`: 409 for conflicts (e.g., duplicate).
  - `ValidationError`: 400 for invalid input.
  - `ExternalError`: 500 for external service failures.
- Error messages are descriptive strings.
- Middleware catches exceptions and formats responses.

## Validation
- Centralized validation middleware (`validateRequest`) for headers, body, params.
- Validators use Joi schemas for request validation.
- Validation happens before controllers; invalid requests throw `ValidationError`.
- Keep validation schemas in `src/validators/`.

## Mastercard integration
- Gateway abstraction in services.
- Base URL: `https://sandbox.api.mastercard.com` (from env).
- Timeout: 5000 ms.
- Retries: handled by axios or gateway logic.
- Supported endpoints:
  - `POST /v1/payments`
  - `POST /v1/cards`
- Map Mastercard errors to domain exceptions:
  - 400 -> ValidationError
  - 402 -> ConflictError (insufficient funds)
  - timeout/other -> ExternalError

## Business rules
- Maximum payment amount: $50,000 USD.
- Fee rates:
  - USD = 2.9%
  - EUR = 3.5%
  - BRL = 4.9%
- Card limits:
  - standard = $10,000
  - premium = $50,000
- Fraud flag conditions:
  - amount > $10,000, or
  - card age < 7 days AND amount > $5,000 AND currency != USD.
- Rules implemented in `src/domain/` or service logic.

## Endpoint and domain expectations
For AI feature work, preserve these endpoints and behaviors:
- User CRUD operations via controllers.
- Payment create with Mastercard gateway call.
- Payment refund with status updates.
- Mastercard webhook processing.
- Centralized validation and error handling.

## Implementation guidance
- Use dependency injection; wire components in `src/container.js`.
- Keep controllers thin; delegate to services/operations.
- Use async/await for asynchronous operations.
- Prefer explicit error throwing over generic responses.
- Maintain separation: routes don't contain logic, services don't handle HTTP.
- Use environment variables via `process.env` in gateways or config.

## Example operation
See `src/services/paymentService.js` for service layer patterns, and `src/controllers/userController.js` for controller actions.