const session = require('express-session');
const FileStore = require('session-file-store')(session);

module.exports = session({  
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,     // [default] true
  store: new FileStore({    
    reapInterval: 60 * 1000     // [default] 1hour
  }),
  cookie: {
    httpOnly: true,
    secure: false,              // [recommended] true
    maxAge: 10 * 60 * 1000
  }
});
