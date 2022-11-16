const { StatusCodes } = require('http-status-codes');

const provider = require('./provider');


exports.login = async function (username, password) {
  const usernameRows = await provider.usernameCheck(username);

  if (usernameRows.length < 1) {
    const err = new Error("가입되지 않은 아이디입니다.")
    err.status = StatusCodes.UNAUTHORIZED;
    return Promise.reject(err);
  }

  return usernameRows;
};