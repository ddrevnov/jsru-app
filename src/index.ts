import app from './app';
import logger from './utils/logger';
import config from './utils/config';

const PORT = config.server.port;
const HOST = config.server.host;

app.listen(PORT, () => {
  logger.info(`App is running on ${HOST}:${PORT}`);
});
