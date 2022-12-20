const { pool } = require('../../config/database');
const dao = require('./dao');

exports.getLeaderBoard = async function (limit, page) {
  const connection = await pool.getConnection(async (conn) => conn);

  const offset = (page - 1) * limit;
  const selectLeaderBoardParams = [parseInt(limit), offset];
  
  const result = await dao.selectLeaderBoard(connection, selectLeaderBoardParams);
  connection.release();

  return result;
};