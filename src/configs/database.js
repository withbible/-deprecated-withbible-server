const mysql = require("mysql2/promise");

// INTERNAL IMPORT
const path = require("path");
const { logger } = require("./logger");

// CONSTANT
const fileName = path.basename(__filename, ".js");

// CONFIG
const pool = mysql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  port: process.env.SQL_PORT,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
});

// MAIN
(async function () {
  try {
    await pool.query("SELECT 1");

    logger.info("MariaDB 10.5 connected");
  } catch (err) {
    logger.error(`[${fileName}]_${err.message}`);
    pool.end();
  }
})();

module.exports = {
  pool,
};
