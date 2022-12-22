const session = require("express-session");
const FileStore = require("session-file-store")(session);

module.exports = session({
  name: "logInData",
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new FileStore({
    reapInterval: 10 * 60,
  }),
  cookie: {
    httpOnly: true,
    secure: false, // [recommended] true
    maxAge: 10 * 60 * 60 * 1000, // [dev] 10H      [prod] 1day
  },
});
