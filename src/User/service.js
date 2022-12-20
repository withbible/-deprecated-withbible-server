const bcypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

//INTERNAL IMPORT
const { pool } = require("../../config/database");
const provider = require("./provider");
const dao = require("./dao");
const leaderBoardDao = require("../LeaderBoard/dao");

exports.postUser = async function (userID, password, userName) {
  const userIDRows = await provider.userIDCheck(userID);

  if (userIDRows.length > 0) {
    const err = new Error("중복된 아이디입니다.");
    err.status = StatusCodes.UNAUTHORIZED;
    return Promise.reject(err);
  }

  const saltRounds = 10;
  const hashedPassword = await bcypt.hash(password, saltRounds);

  const insertUserParams = [userID, hashedPassword, userName];
  const connection = await pool.getConnection(async (conn) => conn);

  try {
    await connection.beginTransaction();

    const newUserRow = await dao.insertUser(connection, insertUserParams);
    const userSeq = newUserRow.insertId;

    await leaderBoardDao.insertLeaderBoard(connection, userSeq);
    await connection.commit();

    return Promise.resolve({
      userSeq,
      userID,
    });
  } catch (err) {
    await connection.rollback();

    return Promise.reject(err);
  } finally {
    connection.release();
  }
};

exports.login = async function (userID, password) {
  const userIDRows = await provider.userIDCheck(userID);

  if (userIDRows.length < 1) {
    const err = new Error("가입되지 않은 아이디입니다.");
    err.status = StatusCodes.UNAUTHORIZED;
    return Promise.reject(err);
  }

  const selectUserID = userIDRows[0]["user_id"];

  const isValidPassword = await bcypt.compare(
    password,
    userIDRows[0]["hashed_password"]
  );

  if (!isValidPassword) {
    const err = new Error("비밀번호가 잘못 되었습니다.");
    err.status = StatusCodes.UNAUTHORIZED;
    return Promise.reject(err);
  }

  return Promise.resolve({
    userSeq: userIDRows[0]["user_seq"],
    userID: selectUserID,
  });
};
