const axios = require('axios');
const config = require('../../config');

const client = axios.create({
  baseURL: config.mcBase,
  timeout: config.mcTimeout,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${Buffer.from(`${config.mcApiKey}:${config.mcSecret}`).toString('base64')}`
  }
});

module.exports = client;
