const redis = require('redis');

module.exports = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
});