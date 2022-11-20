const { pool } = require("../../config/database");
const dao = require('./dao');

exports.getCategory = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await dao.selectCategory(connection);
  connection.release();

  return result;
};

exports.getChapter = async function (categoryID) {
  const connection = await pool.getConnection(async (conn) => conn);

  if (categoryID)
    result = await dao.searchChapter(connection, categoryID);
  else
    result = await dao.selectChapter(connection);

  connection.release();

  return result;

};