const poolPromise = require("../configs/database");
const dao = require("./dao");

exports.getToken = async function (userID) {
  const pool = await poolPromise;
  const rows = userID
    ? await dao.searchToken(pool, userID)
    : await dao.selectToken(pool);

  const result = rows.map((each) => each.token);
  return Promise.resolve(result);
};

exports.getCreatedCountByPrevMonth = async function () {
  const pool = await poolPromise;
  const [result] = await dao.selectCreatedCountByPrevMonth(pool);

  return Promise.resolve(result);
};
