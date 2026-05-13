const config = require('./config');
const app = require('./app');

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`app1 running on http://localhost:${config.port}`);
});
