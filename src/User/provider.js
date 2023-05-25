const poolPromise = require("../configs/database");
const dao = require("./dao");

exports.userIDCheck = async (userID) => {
  const pool = await poolPromise;
  const result = await dao.selectUserID(pool, userID);

  return result;
};
