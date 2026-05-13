// @domain:user | @op:read | @needs:none | @side_effects:read
// @changed:2026-05-12 | @tokens:~50
const { ok, fail } = require('../../shared/response');
const errors = require('../../shared/errors');
const { users } = require('../../shared/store');

const readUser = async (id) => {
  const user = users.find((u) => u.id === id);
  if (!user) return fail(errors.not_found, 'user_not_found');
  return ok(user);
};

// TEST:readUser
// GIVEN: existing user id
// THEN: returns {ok:true, data:{id}}

module.exports = readUser;
