const mysql = require("mysql2/promise");

// INTERNAL IMPORT
const logger = require("./logger");
const { getSSLConfigRemote } = require("./ssl");

// CONSTANT
const dbConfig = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  port: process.env.SQL_PORT,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
};

// HELPER FUNCTION
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// MAIN
class Database {
  static async init() {
    try {
      const sslConfig = await getSSLConfigRemote();

      this.pool = this.waitForDB({ ...dbConfig, ...sslConfig });
    } catch (err) {
      logger.error(err);
    }
  }

  static async waitForDB(dbConfig, times = 1) {
    try {
      const pool = mysql.createPool(dbConfig);
      await pool.query("SELECT 1");

      logger.info("MySQL connected");
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
      return this.waitForDB(dbConfig, times + 1);
    }
  }

  static getPool() {
    return this.pool;
  }
}

module.exports = Database;
