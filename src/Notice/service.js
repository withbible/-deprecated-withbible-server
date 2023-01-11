const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const { pool } = require("../configs/database");
const provider = require("./provider");
const dao = require("./dao");

exports.postToken = async function (token, userSeq) {
  const result = await provider.getToken(userSeq);

  if (result) {
    const err = new Error("중복된 데이터입니다.");
    err.status = StatusCodes.METHOD_NOT_ALLOWED;
    return Promise.reject(err);
  }

  const connection = await pool.getConnection(async (conn) => conn);

  try {
    await dao.insertToken(connection, [token, userSeq]);
  } catch (err) {
    err.status = StatusCodes.INTERNAL_SERVER_ERROR;
    return Promise.reject(err);
  } finally {
    connection.release();
  }

  return Promise.resolve();
};
