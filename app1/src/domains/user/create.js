// @domain:user | @op:create | @needs:joi | @side_effects:write
// @changed:2026-05-12 | @tokens:~90
const Joi = require('joi');
const { ok, fail } = require('../../shared/response');
const errors = require('../../shared/errors');
const { users } = require('../../shared/store');

const createUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('standard','admin').default('standard')
});

const businessRules = {
  ensureUniqueEmail: (email) => !users.some((u) => u.email === email)
};

const validateCreateUser = (payload) => {
  const { error, value } = createUserSchema.validate(payload);
  if (error) return fail(errors.bad_req, 'invalid_user_payload');
  return ok(value);
};

const createUser = async (payload) => {
  const valid = validateCreateUser(payload);
  if (!valid.ok) return valid;
  if (!businessRules.ensureUniqueEmail(valid.data.email)) return fail(errors.conflict, 'user_exists');
  const user = { id: `u_${Date.now()}`, ...valid.data, createdAt: new Date().toISOString() };
  users.push(user);
  return ok(user);
};

// TEST:createUser
// GIVEN: {name:'Alice', email:'alice@example.com'}
// THEN: returns {ok:true, data:{id, name:'Alice'}}

module.exports = createUser;
