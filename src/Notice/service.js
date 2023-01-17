const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const { pool } = require("../configs/database");
const dao = require("./dao");

exports.putToken = async function (token, userID) {
  const connection = await pool.getConnection(async (conn) => conn);

  try {
    await dao.updateToken(connection, [token, userID]);
  } catch (err) {
    err.status = StatusCodes.INTERNAL_SERVER_ERROR;
    return Promise.reject(err);
  } finally {
    connection.release();
  }

  return Promise.resolve();
};
