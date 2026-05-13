// @domain:user | @op:list | @needs:none | @side_effects:read
// @changed:2026-05-12 | @tokens:~30
const { ok } = require('../../shared/response');
const { users } = require('../../shared/store');

const listUsers = async () => ok(users);

// TEST:listUsers
// GIVEN: many users
// THEN: returns {ok:true, data:[users]}

module.exports = listUsers;
