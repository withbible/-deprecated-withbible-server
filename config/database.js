const mysql = require('mysql2/promise');
const { logger } = require('./logger');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  port: process.env.MYSQL_PORT,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

pool.query("SELECT 1")
  .then( _ => {
    logger.info("MySQL connected");
  })
  .catch(err => {
    logger.error(err.message);
    pool.end();
  });

module.exports = {
  pool
};