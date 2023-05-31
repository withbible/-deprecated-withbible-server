const mysql = require("mysql2/promise");

// INTERNAL IMPORT
const path = require("path");
const logger = require("./logger");
const BaseConfig = require("./base");
const { getSSLConfigRemote } = require("./ssl");

// CONSTANT
const dbConfig = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  port: process.env.SQL_PORT,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
};
const fileName = path.basename(__filename, ".js");

// MAIN
function Database() {
  BaseConfig.call(this);

  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  const retry = async (dbConfig, times = 1) => {
    try {
      const pool = mysql.createPool(dbConfig);
      await pool.query("SELECT 1");

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

      await sleep(backoff);
      return this.retry(dbConfig, times + 1);
    }
  };

  return {
    async init() {
      try {
        const sslConfig = await getSSLConfigRemote();
        this.pool = retry({ ...dbConfig, ...sslConfig });

        logger.info("MySQL connected");
      } catch (err) {
        logger.error(`[${fileName}]_${err.message}`);
      }
    },

    get() {
      return this.pool;
    },
  };
}

Database.prototype = Object.create(BaseConfig.prototype);
Database.prototype.constructor = Database;

module.exports = new Database();
