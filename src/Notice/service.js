const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const dao = require("./dao");

exports.putToken = async (token, userID) => {
  const pool = await require("../configs/database").getPool();

  try {
    await dao.updateToken(pool, [token, userID]);
  } catch (err) {
    err.status = StatusCodes.INTERNAL_SERVER_ERROR;
    return Promise.reject(err);
  }

  return Promise.resolve();
};
