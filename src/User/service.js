const bcypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const { pool } = require('../../config/database');
const provider = require('./provider');
const dao = require('./dao');

exports.postUser = async function (userID, password, name) {
  const userIDRows = await provider.userIDCheck(userID);

  if (userIDRows.length > 0) {
    const err = new Error("중복된 아이디입니다.");
    err.status = StatusCodes.UNAUTHORIZED;
    return Promise.reject(err);
  }

  const saltRounds = 10;
  const hashedPassword = await bcypt.hash(password, saltRounds);

  const insertUserParams = [userID, hashedPassword, name];
  const connection = await pool.getConnection(async (conn) => conn);
  await dao.insertUser(connection, insertUserParams);  
  connection.release();

  return {    
    userID,
    name
  };
};

exports.login = async function (userID, password) {
  const userIDRows = await provider.userIDCheck(userID);

  if (userIDRows.length < 1) {
    const err = new Error("가입되지 않은 아이디입니다.")
    err.status = StatusCodes.UNAUTHORIZED;
    return Promise.reject(err);
  }

  const selectUserID = userIDRows[0].userID;

  const isValidPassword = await bcypt.compare(
    password,
    userIDRows[0].hashedPassword
  );

  if (!isValidPassword) {
    const err = new Error("비밀번호가 잘못 되었습니다.")
    err.status = StatusCodes.UNAUTHORIZED;
    return Promise.reject(err);
  }

  return {
    'userID': selectUserID
  };
};