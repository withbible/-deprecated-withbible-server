const redis = require("redis");

// INTERNAL IMPORT
const logger = require("../configs/logger");
const BaseThirdPartyConfig = require("./base");
const { MAX_RETRY_ATTEMPTS } = require("../constants");

// CONSTANT
const redisConfig = {
  url: process.env.REDIS_URL,
};

// MAIN
function SessionStorage() {
  BaseThirdPartyConfig.call(this);

  return {
    init,
    get,
  };

  async function init() {
    try {
      this.client = redis.createClient(redisConfig);
      await this.client.connect();

      logger.info("Redis connected");
    } catch (err) {
      retry();
    }
  }

  async function retry() {
    this.client = redis.createClient(redisConfig);
    await this.client.connect();

    let attempts = 0;

    this.client.on("connect", () => {
      attempts = 0;
    });

    this.client.on("reconnecting", () => {
      attempts += 1;
      logger.warn(`Unable to connect to Redis, trying again immediately`);
    });

    this.client.on("error", () => {
      if (attempts > MAX_RETRY_ATTEMPTS) {
        logger.error(
          `Unable to connect to Redis in ${attempts} attempts, exiting`
        );

        process.exit(1);
      }
    });
  }

  function get() {
    return this.client;
  }
}

SessionStorage.prototype = Object.create(BaseThirdPartyConfig.prototype);
SessionStorage.prototype.constructor = SessionStorage;

module.exports = new SessionStorage();
