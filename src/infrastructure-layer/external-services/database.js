const mysql = require("mysql2/promise");

// INTERNAL IMPORT
const logger = require("../configs/logger");
const BaseThirdPartyConfig = require("./base");
const getSSLConfigRemote = require("../configs/ssl-config-remote");
const { sleep, getBackOff } = require("../../utils");
const { MAX_RETRY_ATTEMPTS, EXIT_CODE } = require("../constants");

// CONSTANT
const dbConfig = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  port: process.env.SQL_PORT,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
};

// MAIN
function Database() {
  BaseThirdPartyConfig.call(this);
  this.pool = null;
}

Database.prototype = Object.create(BaseThirdPartyConfig.prototype);
Database.prototype.constructor = Database;

Database.prototype.init = async function () {
  try {
    const sslConfig = await getSSLConfigRemote();
    this.pool = mysql.createPool({ ...dbConfig, ...sslConfig });

    logger.info("MySQL connected");
  } catch (err) {
    await this.retry();
  }
};

Database.prototype.retry = async function (attempts = 1) {
  try {
    await this.pool.query("SELECT 1");
  } catch (err) {
    if (attempts > MAX_RETRY_ATTEMPTS) {
      logger.error(
        `Unable to connect to MySQL in ${attempts} attempts, exiting`
      );
      process.exit(EXIT_CODE.APP_DEFINE_EXIT);
    }

    const backoff = getBackOff(attempts);
    logger.warn(`Unable to connect to MySQL, trying again in ${backoff}ms
    `);

    await sleep(backoff);
    return this.retry(attempts + 1);
  }
};

Database.prototype.get = async function () {
  return this.pool;
};

module.exports = new Database();
