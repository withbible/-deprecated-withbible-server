const session = require("express-session");
const FileStore = require("session-file-store")(session);

module.exports = session({
  name: "loginData",
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  store: new FileStore({
    /**
     * number by seconds
     *
     * [default] 1H
     */
    reapInterval: 60 * 60,
    reapAsync: true,
  }),
  cookie: {
    httpOnly: true,
    secure: false,

    /**
     * number by milliseconds
     *
     * [default] no maximum
     * [dev] 10H
     * [prod] 1D
     */
    maxAge: 10 * 60 * 60 * 1000,
  },
});
