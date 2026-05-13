const createUserController = (userOperations) => ({
  create: async (req, res) => {
    try {
      const user = await userOperations.create(req.validated.body);
      return res.status(201).json(user);
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({ error: { code: error.code || '5000', message: error.message || 'internal_error' } });
    }
  },
  list: async (req, res) => {
    try {
      const users = await userOperations.list();
      return res.status(200).json(users);
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({ error: { code: error.code || '5000', message: error.message || 'internal_error' } });
    }
  },
  read: async (req, res) => {
    try {
      const user = await userOperations.read(req.validated.params.id);
      return res.status(200).json(user);
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({ error: { code: error.code || '5000', message: error.message || 'internal_error' } });
    }
  },
  update: async (req, res) => {
    try {
      const user = await userOperations.update(req.validated.params.id, req.validated.body);
      return res.status(200).json(user);
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({ error: { code: error.code || '5000', message: error.message || 'internal_error' } });
    }
  },
  delete: async (req, res) => {
    try {
      const payload = await userOperations.delete(req.validated.params.id);
      return res.status(200).json(payload);
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({ error: { code: error.code || '5000', message: error.message || 'internal_error' } });
    }
  }
});

module.exports = createUserController;
