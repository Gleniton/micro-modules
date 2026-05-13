const express = require('express');
const createUser = require('./domains/user/create');
const readUser = require('./domains/user/read');
const updateUser = require('./domains/user/update');
const deleteUser = require('./domains/user/delete');
const listUsers = require('./domains/user/list');
const createPayment = require('./domains/payment/create');
const refundPayment = require('./domains/payment/refund');
const webhookMastercard = require('./domains/payment/webhook');
const rateLimiter = require('./shared/rateLimiter');

const app = express();
app.use(express.json());
app.use(rateLimiter);

app.post('/users', async (req, res) => {
  const out = await createUser(req.body);
  res.status(out.ok ? 200 : 400).json(out);
});

app.get('/users', async (req, res) => {
  const out = await listUsers();
  res.status(out.ok ? 200 : 400).json(out);
});

app.get('/users/:id', async (req, res) => {
  const out = await readUser(req.params.id);
  res.status(out.ok ? 200 : 400).json(out);
});

app.put('/users/:id', async (req, res) => {
  const out = await updateUser(req.params.id, req.body);
  res.status(out.ok ? 200 : 400).json(out);
});

app.delete('/users/:id', async (req, res) => {
  const out = await deleteUser(req.params.id);
  res.status(out.ok ? 200 : 400).json(out);
});

app.post('/payments', async (req, res) => {
  const out = await createPayment(req.body);
  res.status(out.ok ? 200 : 400).json(out);
});

app.post('/payments/:id/refund', async (req, res) => {
  const out = await refundPayment(req.params.id, req.body.amount);
  res.status(out.ok ? 200 : 400).json(out);
});

app.post('/webhooks/mastercard', async (req, res) => {
  const out = await webhookMastercard(req.body, req.headers);
  res.status(out.ok ? 200 : 400).json(out);
});

module.exports = app;
