const morgan = require('morgan');

const { logger } = require('../../config/logger');

module.exports = morgan(
  'dev',
  { stream: logger.stream }
);