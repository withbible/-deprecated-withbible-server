const mysql = require("mysql2/promise");

// INTERNAL IMPORT
const path = require("path");
const { logger } = require("./logger");

// CONSTANT
const fileName = path.basename(__filename, ".js");
const dbConfig = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  port: process.env.SQL_PORT,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
};

// MAIN
// eslint-disable-next-line no-shadow
function waitForDB(dbConfig, times = 1) {
  try {
    const pool = mysql.createPool(dbConfig);

    logger.info("MariaDB 10.5 connected");
    return pool;
  } catch (err) {
    if (times > 5) {
      logger.error(
        `[${fileName}]_Unable to connect to database in ${times} attemps, exiting`
      );
      process.exit();
    }

    const backoff = 2 ** (times - 1) * 1000;
    logger.warn(
      `[${fileName}]_Unable to connect to database, trying again in ${backoff}ms`
    );

    setTimeout(backoff);
    return waitForDB(dbConfig, times + 1);
  }
}

module.exports = (function () {
  const pool = waitForDB(dbConfig);
  return pool;
})();
