# System Context for AI

## Purpose
This file defines the conventions and constraints for `app1` so AI can create and modify features consistently and efficiently.
Focus on fast, reliable implementation over abstraction. Keep operations small, explicit, and predictable.

## Architecture
- One operation per file: validation, business rules, and external calls live together in a single domain operation.
- Each operation returns one of:
  - `{ ok: true, data: ... }`
  - `{ ok: false, err: { code, message, details? } }`
- Prefer plain objects and simple literals; avoid deep nested classes or frameworks.
- No shared state between operations except the in-memory data stores and environment config.

## File and naming conventions
- Use `createX`, `getX`, `updateX`, `deleteX`, `listX` for CRUD operations.
- Use `fetchX` for external HTTP calls.
- Use `validateX` for input validation helpers that return `{ ok, err }`.
- Use `calcX` for pure computations without side effects.
- Use `mapX`, `buildX`, `formatX` for transformation helpers.
- Use `useX` or `getXClient` only for simple client/provider factories.

## Response contract
- Successful result: `{ ok: true, data: result }`
- Error result: `{ ok: false, err: { code: 4-digit, message: string, details?: any } }`
- Error codes are numeric and stable.
- Do not throw errors across file boundaries unless caught immediately within the operation.

## Error codes
- 4001 = bad_req
- 4020 = insuf_funds
- 5000 = timeout
- 5001 = mc_error
- 4004 = not_found
- 4090 = already_exists

## Validation
- Validate inputs before business logic.
- Validation helpers return `{ ok: true }` or `{ ok: false, err }`.
- If validation fails, return `ok: false` immediately.
- Use simple schema checks and value guards; do not introduce external validation frameworks in `app1`.

## Mastercard integration
- Base URL: `https://sandbox.api.mastercard.com` (from env)
- Timeout: 5000 ms
- Retries: 1 retry on transient failure.
- Supported endpoints:
  - `POST /v1/payments`
  - `POST /v1/cards`
- Map Mastercard errors to local error codes:
  - 400 -> 4001
  - 402 -> 4020
  - timeout -> 5000
  - other Mastercard failures -> 5001

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

## Endpoint and domain expectations
For AI feature work, preserve these endpoints and behaviors:
- User CRUD operations
- Payment create with Mastercard call
- Payment refund
- Mastercard webhook processing
- Inline validation and error mapping in domain operations

## Implementation guidance
- Keep each operation file lean and direct.
- Prefer explicit returns over helper wrappers when possible.
- Use consistent object shapes for data and errors.
- Avoid generic response wrappers beyond `{ ok, data, err }`.
- Use environment values from `process.env` only in external-call helpers.

## Example operation
See `src/domains/payment/create.js` for the canonical implementation pattern.
