const session = require('express-session');
const FileStore = require('session-file-store')(session);

module.exports = session({
  key: 'loginData',
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,     // [default] true
  store: new FileStore({
    
    // TODO: 만료된 세션 백그라운드에서 자동 삭제 (해당 옵션 원하는 데로 작동하지 않음)
    reapAsync: true
  }),
  cookie: {
    httpOnly: true,
    secure: false,              // [recommended] true
    maxAge: 20 * 1000
  }
});
