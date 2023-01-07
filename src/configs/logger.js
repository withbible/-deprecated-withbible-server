const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.colorize(),
    format.errors({ stack: true }),
    format.printf(
      (info) =>
        `${info.timestamp} ｜ ${info.level}: ${info.stack || info.message}`
    )
  ),
  transports: [
    new transports.Console({
      handleExceptions: true,
    }),
  ],
});

logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = {
  logger,
};
