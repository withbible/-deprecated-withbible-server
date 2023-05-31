const redis = require("redis");

// INTERNAL IMPORT
const path = require("path");
const logger = require("./logger");
const BaseConfig = require("./base");

// CONSTANT
const redisConfig = {
  url: process.env.REDIS_URL,
};
const fileName = path.basename(__filename, ".js");

// MAIN
function SessionStorage() {
  BaseConfig.call(this);

  const retry = () => {
    const client = redis.createClient(redisConfig);
    let times = 0;

    client.on("connect", () => {
      times = 0;
    });

    client.on("reconnecting", () => {
      times += 1;
      logger.warn(`Unable to connect to Redis, trying again immediately`);
    });

    client.on("error", () => {
      if (times > 5) {
        logger.error(
          `Unable to connect to Redis in ${times} attempts, exiting`
        );

        process.exit();
      }
    });

    return client;
  };

  return {
    async init() {
      try {
        this.client = retry();
        await this.client.connect();

        logger.info("Redis connected");
      } catch (err) {
        logger.error(`[${fileName}]_${err.message}`);
      }
    },

    get() {
      return this.client;
    },
  };
}

SessionStorage.prototype = Object.create(BaseConfig.prototype);
SessionStorage.prototype.constructor = SessionStorage;

module.exports = new SessionStorage();
