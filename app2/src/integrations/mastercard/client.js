const axios = require('axios');

const createMastercardClient = (config) => axios.create({
  baseURL: config.mcBase,
  timeout: config.mcTimeout,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(`${config.mcApiKey}:${config.mcSecret}`).toString('base64')}`
  }
});

module.exports = createMastercardClient;
