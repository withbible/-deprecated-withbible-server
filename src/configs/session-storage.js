const redis = require("redis");

// INTERNAL IMPORT
const path = require("path");
const logger = require("./logger");
const BaseThirdPartyConfig = require("./base");
const { MAX_RETRY_ATTEMPTS } = require("../constants");

// CONSTANT
const redisConfig = {
  url: process.env.REDIS_URL,
};
const fileName = path.basename(__filename, ".js");

// MAIN
function SessionStorage() {
  BaseThirdPartyConfig.call(this);

  const retry = () => {
    const client = redis.createClient(redisConfig);
    let attempts = 0;

    client.on("connect", () => {
      attempts = 0;
    });

    client.on("reconnecting", () => {
      attempts += 1;
      logger.warn(`Unable to connect to Redis, trying again immediately`);
    });

    client.on("error", () => {
      if (attempts > MAX_RETRY_ATTEMPTS) {
        logger.error(
          `Unable to connect to Redis in ${attempts} attempts, exiting`
        );

        process.exit(1);
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

SessionStorage.prototype = Object.create(BaseThirdPartyConfig.prototype);
SessionStorage.prototype.constructor = SessionStorage;

module.exports = new SessionStorage();
