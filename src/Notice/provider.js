const { pool } = require("../configs/database");
const dao = require("./dao");

exports.getToken = async function (userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const rows = await dao.selectToken(connection, userSeq);
  connection.release();

  const result = rows[0].token;
  return Promise.resolve(result);
};
