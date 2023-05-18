const mysql = require("mysql2/promise");
const fs = require("fs");

// INTERNAL IMPORT
const logger = require("./logger");

// CONSTANT
const dbConfig = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  port: process.env.SQL_PORT,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  ssl: {
    key: fs.readFileSync("./etc/certs/localhost-key.pem"),
    cert: fs.readFileSync("./etc/certs/localhost.pem"),
  },
};

// MAIN
// eslint-disable-next-line no-shadow
function waitForDB(dbConfig, times = 1) {
  try {
    const pool = mysql.createPool(dbConfig);
    pool.query("SELECT 1");

    logger.info("MariaDB 10.5 connected");
    return pool;
  } catch (err) {
    if (times > 5) {
      logger.error(
        `Unable to connect to database in ${times} attemps, exiting`
      );
      process.exit();
    }

    const backoff = 2 ** (times - 1) * 1000;
    logger.warn(`Unable to connect to database, trying again in ${backoff}ms
    `);

    setTimeout(() => undefined, backoff);
    return waitForDB(dbConfig, times + 1);
  }
}

module.exports = (function () {
  const pool = waitForDB(dbConfig);
  return pool;
})();
