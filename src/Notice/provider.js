const pool = require("../configs/database");
const dao = require("./dao");

exports.getToken = async function (userID) {
  const connection = await pool.getConnection(async (conn) => conn);

  const rows = userID
    ? await dao.searchToken(connection, userID)
    : await dao.selectToken(connection);
  connection.release();

  const result = rows.map((each) => each.token);
  return Promise.resolve(result);
};

exports.getCreatedCountByPrevMonth = async function () {
  const connection = await pool.getConnection(async (conn) => conn);

  const [result] = await dao.selectCreatedCountByPrevMonth(connection);
  return Promise.resolve(result);
};
