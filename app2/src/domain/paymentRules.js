const feeRates = { USD: 0.029, EUR: 0.035, BRL: 0.049 };

const calcFee = (amount, currency) => Math.round((amount * (feeRates[currency] || 0.03)) * 100) / 100;
const isFraud = ({ amount, currency }) => amount > 10000 || (currency !== 'USD' && amount > 5000);

module.exports = { calcFee, isFraud };
