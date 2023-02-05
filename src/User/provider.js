const pool = require("../configs/database");
const dao = require("./dao");

exports.userIDCheck = async function (userID) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await dao.selectUserID(connection, userID);
  connection.release();

  return result;
};
