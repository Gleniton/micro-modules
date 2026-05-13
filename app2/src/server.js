const config = require('./config');
const createApp = require('./app');
const createContainer = require('./container');

const container = createContainer();
const app = createApp(container);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`app2 running on http://localhost:${config.port}`);
});
