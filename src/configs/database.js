const mysql = require("mysql2/promise");

// INTERNAL IMPORT
const path = require("path");
const logger = require("./logger");
const BaseThirdPartyConfig = require("./base");
const { getSSLConfigRemote } = require("./ssl");
const { MAX_RETRY_ATTEMPTS } = require("../constants");
const { sleep, getBackOff } = require("../utils");

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
  BaseThirdPartyConfig.call(this);

  const retry = async (dbConfig, attempts = 1) => {
    try {
      const pool = mysql.createPool(dbConfig);
      await pool.query("SELECT 1");

      return pool;
    } catch (err) {
      if (attempts > MAX_RETRY_ATTEMPTS) {
        logger.error(
          `Unable to connect to database in ${attempts} attemps, exiting`
        );
        process.exit(1);
      }

      const backoff = getBackOff(attempts);
      logger.warn(`Unable to connect to database, trying again in ${backoff}ms
      `);

      await sleep(backoff);
      return this.retry(dbConfig, attempts + 1);
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

Database.prototype = Object.create(BaseThirdPartyConfig.prototype);
Database.prototype.constructor = Database;

module.exports = new Database();
