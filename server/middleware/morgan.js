const morgan = require('morgan');

const logger = require('../log')

module.exports = morgan(
  'dev',
  {stream : logger.stream}
);