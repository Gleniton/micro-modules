const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 3002,
  mcBase: process.env.MC_BASE || 'https://sandbox.api.mastercard.com',
  mcTimeout: 5000,
  mcApiKey: process.env.MC_API_KEY || '',
  mcSecret: process.env.MC_SECRET || ''
};
