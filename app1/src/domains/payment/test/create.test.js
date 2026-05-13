const createPayment = require('../create');

(async () => {
  const payload = { userId: 'u_test', cardId: 'card_123', amount: 100, currency: 'USD' };
  const result = await createPayment(payload);
  console.log(result.ok ? 'PASS' : 'FAIL', result);
})();
