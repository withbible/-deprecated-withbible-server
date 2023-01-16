const { pool } = require("../configs/database");
const dao = require("./dao");

exports.getToken = async function (userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const rows = userSeq
    ? await dao.searchToken(connection, userSeq)
    : await dao.selectToken(connection);
  connection.release();

  const result = rows.map((each) => each.token);
  return Promise.resolve(result);
};
