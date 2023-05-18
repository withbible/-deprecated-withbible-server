const mysql = require("mysql2/promise");
const axios = require("axios");

// INTERNAL IMPORT
const logger = require("./logger");

// CONSTANT
const dbConfig = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  port: process.env.SQL_PORT,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
};
const headers = {
  Authorization: `Bearer ${process.env.GHP_SERVER_ETC_ACCESS_TOKEN}`,
  Accept: "application/vnd.github.raw",
};
const REPO_URL =
  "https://api.github.com/repos/WithBible/withbible-server-etc/contents";

// HELPER FUNCTION
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// MAIN
// eslint-disable-next-line no-shadow
async function waitForDB(dbConfig, times = 1) {
  try {
    const pool = mysql.createPool(dbConfig);
    await pool.query("SELECT 1");

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

    await sleep(backoff);
    return waitForDB(dbConfig, times + 1);
  }
}

// eslint-disable-next-line consistent-return
module.exports = (async function () {
  try {
    const [keyResponse, certResponse] = await Promise.all([
      axios.get(`${REPO_URL}/certs/localhost-key.pem`, {
        headers,
      }),
      axios.get(`${REPO_URL}/certs/localhost.pem`, {
        headers,
      }),
    ]);

    const sslConfig = {
      ssl: {
        key: keyResponse.data,
        cert: certResponse.data,
      },
    };

    const pool = await waitForDB({ ...dbConfig, ...sslConfig });
    return pool;
  } catch (err) {
    logger.error(err);
  }
})();
