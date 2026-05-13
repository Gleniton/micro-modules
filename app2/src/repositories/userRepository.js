const { users } = require('./inMemoryStore');

const createUserRepository = () => ({
  create: async (user) => { users.push(user); return user; },
  findById: async (id) => users.find((u) => u.id === id) || null,
  findByEmail: async (email) => users.find((u) => u.email === email) || null,
  update: async (id, updates) => {
    const user = users.find((u) => u.id === id);
    if (!user) return null;
    Object.assign(user, updates);
    return user;
  },
  delete: async (id) => {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  },
  list: async () => [...users]
});

module.exports = createUserRepository;
