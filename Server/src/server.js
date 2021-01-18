const http = require('http');
const app = require('./app');
require('dotenv').config();
const logger = require('./lib/logger');

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`Listening at http://localhost:${PORT}`);
});
