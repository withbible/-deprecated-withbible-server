const dao = require("./dao");

exports.userIDCheck = async (userID) => {
  const pool = await require("../configs/database").getPool();
  const result = await dao.selectUserID(pool, userID);

  return result;
};
