const redis = require("redis");

// INTERNAL IMPORT
const { logger } = require("./logger");

// CONSTANT
const redisConfig = {
  url: process.env.REDIS_URL,
  legacyMode: true,
};

// MAIN
// eslint-disable-next-line no-shadow
function waitForRedis(redisConfig) {
  const client = redis.createClient(redisConfig);
  let times = 0;

  client.on("connect", () => {
    times = 0;
    logger.info("Redis connected");
  });

  client.on("reconnecting", () => {
    times += 1;
    logger.warn(`Unable to connect to Redis, trying again immediately`);
  });

  client.on("error", () => {
    if (times > 5) {
      logger.error(`Unable to connect to Redis in ${times} attempts, exiting`);
      process.exit();
    }
  });

  return client.connect();
}

module.exports = (function () {
  const client = waitForRedis(redisConfig);
  return client;
})();
