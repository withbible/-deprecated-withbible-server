const { pool } = require('../../config/database');
const dao = require('./dao');

exports.usernameCheck = async function (username) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await dao.selectUsername(connection, username);
  connection.release();

  return result;
}