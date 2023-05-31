const bcypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const noticeService = require("../Notice/service");
const noticeProvider = require("../Notice/provider");
const provider = require("./provider");
const dao = require("./dao");
const leaderBoardDao = require("../LeaderBoard/dao");

exports.postUser = async (userID, password, userEmail, token) => {
  const userIDRow = await provider.userIDCheck(userID);

  if (userIDRow.length > 0) {
    const err = new Error("중복된 아이디입니다.");
    err.status = StatusCodes.UNAUTHORIZED;
    return Promise.reject(err);
  }

  const saltRounds = 10;
  const hashedPassword = await bcypt.hash(password, saltRounds);

  const pool = await require("../configs/database").get();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const newUserRow = await dao.insertUser(connection, [
      userID,
      hashedPassword,
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

exports.login = async (userID, password, token) => {
  const [[userIDRow], existedToken] = await Promise.all([
    provider.userIDCheck(userID),
    noticeProvider.getToken(userID),
  ]);

  if (!userIDRow) {
    const err = new Error("가입되지 않은 아이디입니다.");
    err.status = StatusCodes.UNAUTHORIZED;
    return Promise.reject(err);
  }

  const isValidPassword = await bcypt.compare(
    password,
    userIDRow.hahsedPassword
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
    userSeq: userIDRow.userSeq,
    userID: userIDRow.userID,
  });
};
