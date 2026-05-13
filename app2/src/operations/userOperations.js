const userTransformer = require('../transformers/userTransformer');

const createUserOperations = (userService) => ({
  create: async (payload) => {
    const user = await userService.create(payload);
    return userTransformer.toResponse(user);
  },
  list: async () => {
    const users = await userService.list();
    return users.map(userTransformer.toResponse);
  },
  read: async (id) => {
    const user = await userService.read(id);
    return userTransformer.toResponse(user);
  },
  update: async (id, payload) => {
    const user = await userService.update(id, payload);
    return userTransformer.toResponse(user);
  },
  delete: async (id) => {
    await userService.delete(id);
    return { id };
  }
});

module.exports = createUserOperations;
