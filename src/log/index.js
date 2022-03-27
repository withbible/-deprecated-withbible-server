const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.colorize(),
    format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: './combined.log',
      level: 'error'
    })
  ]
});

logger.stream = {
  write: message => {
    logger.info(message.trim());
  }
}

module.exports = logger;