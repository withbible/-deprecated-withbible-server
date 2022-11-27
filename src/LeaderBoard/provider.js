const { pool } = require('../../config/database');
const dao = require('./dao');

exports.getLeaderBoard = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await dao.selectLeaderBoard(connection);
  connection.release();

  return result;
};