const dao = require("./dao");

exports.getCreatedCountByPrevMonth = async () => {
  const pool = await require("../configs/database").get();
  const [result] = await dao.selectCreatedCountByPrevMonth(pool);

  return Promise.resolve(result);
};
