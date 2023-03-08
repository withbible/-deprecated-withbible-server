const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const client = require("../configs/session-storage");

module.exports = session({
  name: "loginData",
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({ client, prefix: "session:" }),
  cookie: {
    httpOnly: true,
    sameSite: "none",
    secure: true,

    /**
     * @description number by milliseconds
     *
     * [default] no maximum
     * [dev] 10H
     */
    maxAge: 10 * 60 * 60 * 1000,
  },
});
