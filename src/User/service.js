const bcypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const { pool } = require("../configs/database");
const noticeService = require("../Notice/service");
const noticeProvider = require("../Notice/provider");
const provider = require("./provider");
const dao = require("./dao");
const leaderBoardDao = require("../LeaderBoard/dao");

exports.postUser = async function (
  userID,
  password,
  userName,
  userEmail,
  token
) {
  const userIDRows = await provider.userIDCheck(userID);

  if (userIDRows.length > 0) {
    const err = new Error("중복된 아이디입니다.");
    err.status = StatusCodes.UNAUTHORIZED;
    return Promise.reject(err);
  }

  const saltRounds = 10;
  const hashedPassword = await bcypt.hash(password, saltRounds);

  const connection = await pool.getConnection(async (conn) => conn);

  try {
    await connection.beginTransaction();

    const newUserRow = await dao.insertUser(connection, [
      userID,
      hashedPassword,
      userName,
      userEmail,
      token,
    ]);
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

exports.login = async function (userID, password, token) {
  const [userIDRows, existedToken] = Promise.all([
    await provider.userIDCheck(userID),
    await noticeProvider.getToken(userID),
  ]);

  if (userIDRows.length < 1) {
    const err = new Error("가입되지 않은 아이디입니다.");
    err.status = StatusCodes.UNAUTHORIZED;
    return Promise.reject(err);
  }

  const isValidPassword = await bcypt.compare(
    password,
    userIDRows[0].hahsedPassword
  );

  if (!isValidPassword) {
    const err = new Error("비밀번호가 잘못 되었습니다.");
    err.status = StatusCodes.UNAUTHORIZED;
    return Promise.reject(err);
  }

  if (!existedToken) {
    const err = new Error("데이터가 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  if (token !== existedToken) {
    await noticeService.putToken(token, userID);
  }

  return Promise.resolve({
    userSeq: userIDRows[0].userSeq,
    userID: userIDRows[0].userID,
  });
};
