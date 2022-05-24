const session = require('express-session');

module.exports = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  name: 'session-cookie',
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 3 * 1000
  }
})