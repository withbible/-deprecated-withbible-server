const redis = require("redis");

// INTERNAL IMPORT
const logger = require("./logger");

// CONSTANT
const redisConfig = {
  url: process.env.REDIS_URL,
};

// MAIN
class SessionStorage {
  static async init() {
    this.waitForRedis();
    await this.client.connect();
  }

  static waitForRedis() {
    this.client = redis.createClient(redisConfig);
    let times = 0;

    this.client.on("connect", () => {
      times = 0;
      logger.info("Redis connected");
    });

    this.client.on("reconnecting", () => {
      times += 1;
      logger.warn(`Unable to connect to Redis, trying again immediately`);
    });

    this.client.on("error", () => {
      if (times > 5) {
        logger.error(
          `Unable to connect to Redis in ${times} attempts, exiting`
        );

        process.exit();
      }
    });
  }

  static getClient() {
    return this.client;
  }
}

module.exports = SessionStorage;
