// @domain:user | @op:delete | @needs:none | @side_effects:write
// @changed:2026-05-12 | @tokens:~45
const { ok, fail } = require('../../shared/response');
const errors = require('../../shared/errors');
const { users } = require('../../shared/store');

const deleteUser = async (id) => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return fail(errors.not_found, 'user_not_found');
  users.splice(index, 1);
  return ok({ id });
};

// TEST:deleteUser
// GIVEN: existing id
// THEN: returns {ok:true, data:{id}}

module.exports = deleteUser;
