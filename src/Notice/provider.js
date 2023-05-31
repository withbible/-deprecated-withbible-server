const dao = require("./dao");

exports.getToken = async (userID) => {
  const pool = await require("../configs/database").get();
  const rows = userID
    ? await dao.searchToken(pool, userID)
    : await dao.selectToken(pool);

  const result = rows.map((each) => each.token);
  return Promise.resolve(result);
};

exports.getCreatedCountByPrevMonth = async () => {
  const pool = await require("../configs/database").get();
  const [result] = await dao.selectCreatedCountByPrevMonth(pool);

  return Promise.resolve(result);
};
