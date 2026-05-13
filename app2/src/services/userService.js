const { ConflictError, NotFoundError } = require('../errors');

const createUserService = (userRepository) => ({
  create: async (data) => {
    const exists = await userRepository.findByEmail(data.email);
    if (exists) throw new ConflictError('user_exists');
    const user = { id: `u_${Date.now()}`, ...data, createdAt: new Date().toISOString() };
    return userRepository.create(user);
  },
  list: async () => userRepository.list(),
  read: async (id) => {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('user_not_found');
    return user;
  },
  update: async (id, data) => {
    const user = await userRepository.update(id, { ...data, updatedAt: new Date().toISOString() });
    if (!user) throw new NotFoundError('user_not_found');
    return user;
  },
  delete: async (id) => {
    const deleted = await userRepository.delete(id);
    if (!deleted) throw new NotFoundError('user_not_found');
    return { id };
  }
});

module.exports = createUserService;
