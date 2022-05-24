const { hash, compare } = require("bcryptjs");
const { StatusCodes } = require('http-status-codes');
const logger = require('../log');
const User = require("../models/User");

const register = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const hashedPassword = await hash(password, 10);

    req.session.user = await User.create({
      name,
      username,
      hashedPassword
    });
    res.sendStatus(StatusCodes.CREATED);

  } catch (err) {
    logger.error(err);
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: err.message
    });
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user)
      throw new Error("가입되지 않은 아이디입니다.");

    const isValid = await compare(password, user.hashedPassword);

    if (!isValid)
      throw new Error("입력하신 정보가 올바르지 않습니다.");

    req.session.user = user;

    logger.info(`${user.username} 로그인`);
    res.status(StatusCodes.OK).json({
      message: `로그인 완료`,
      data: {
        name: user.name
      }
    });

  } catch (err) {
    logger.error(err);
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: err.message
    });
  }
}

const logout = (req, res) => {
  try {
    delete req.session.user;
    res.sendStatus(StatusCodes.NO_CONTENT);

  } catch (err) {
    logger.error(err);
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: err.message
    });
  }
}

module.exports = { register, login, logout }