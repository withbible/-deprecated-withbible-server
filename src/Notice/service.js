const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const poolPromise = require("../configs/database");
const dao = require("./dao");

exports.putToken = async (token, userID) => {
  const pool = await poolPromise;

  try {
    await dao.updateToken(pool, [token, userID]);
  } catch (err) {
    err.status = StatusCodes.INTERNAL_SERVER_ERROR;
    return Promise.reject(err);
  }

  return Promise.resolve();
};
