const session = require('express-session');
const FileStore = require('session-file-store')(session);

module.exports = session({
  name: 'loginData',
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,     // [default] true
  store: new FileStore({
    reapInterval: 60            // [dev] 60sec       [default] 1hour
  }),
  cookie: {
    httpOnly: true,
    secure: false,              // [recommended] true
    maxAge: 10 * 60 * 1000      // [dev] 10min      [prod] 1day
  }
});
