const RedisStore = require("connect-redis").default;
const session = require("express-session");
const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const client = require("../configs/session-storage").getClient();
const { errResponse } = require("../utils/response");

// CONSTANT
const cookieOption = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  maxAge: 15 * 60 * 1000, // +++ 15m
};

const sessionOption = {
  name: "loginData",
  secret: process.env.COOKIE_SECRET,
  resave: true,
  saveUninitialized: false,
  store: new RedisStore({
    client,
    prefix: "session:",
  }),
  cookie: cookieOption,
};

// MAIN
const checkSessionCookie = (req, res, next) => {
  if (!req.session || !req.session.user) {
    res.status(StatusCodes.UNAUTHORIZED);
    return res.json(errResponse({ message: "권한이 없습니다." }));
  }

  return next();
};

module.exports = {
  session: session(sessionOption),
  checkSessionCookie,
  AUTO_LOGIN_AGE: 90 * 24 * 60 * 60 * 1000, // +++ 90d
};
