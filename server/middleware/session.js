const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const redisClient = require('../db/redis');

module.exports = session({
  store: new RedisStore({ client: redisClient }),
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