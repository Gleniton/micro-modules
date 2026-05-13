// @domain:user | @op:update | @needs:joi | @side_effects:write
// @changed:2026-05-12 | @tokens:~70
const Joi = require('joi');
const { ok, fail } = require('../../shared/response');
const errors = require('../../shared/errors');
const { users } = require('../../shared/store');

const updateUserSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email(),
  role: Joi.string().valid('standard','admin')
}).min(1);

const validateUpdateUser = (payload) => {
  const { error, value } = updateUserSchema.validate(payload);
  if (error) return fail(errors.bad_req, 'invalid_user_payload');
  return ok(value);
};

const updateUser = async (id, payload) => {
  const valid = validateUpdateUser(payload);
  if (!valid.ok) return valid;
  const user = users.find((u) => u.id === id);
  if (!user) return fail(errors.not_found, 'user_not_found');
  Object.assign(user, valid.data, { updatedAt: new Date().toISOString() });
  return ok(user);
};

// TEST:updateUser
// GIVEN: existing id, {name:'Bob'}
// THEN: returns {ok:true, data:{name:'Bob'}}

module.exports = updateUser;
