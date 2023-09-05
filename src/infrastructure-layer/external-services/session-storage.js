const redis = require("redis");

// INTERNAL IMPORT
const logger = require("../configs/logger");
const BaseThirdPartyConfig = require("./base");
const { MAX_RETRY_ATTEMPTS, EXIT_CODE } = require("../constants");

// CONSTANT
const redisConfig = {
  url: process.env.REDIS_URL,
};

// MAIN
function SessionStorage() {
  BaseThirdPartyConfig.call(this);
  this.client = null;
}

SessionStorage.prototype = Object.create(BaseThirdPartyConfig.prototype);
SessionStorage.prototype.constructor = SessionStorage;

SessionStorage.prototype.init = async function () {
  this.client = redis.createClient(redisConfig);

  let attempts = 0;

  this.client.on("connect", () => {
    attempts = 0;
    logger.info("Redis connected");
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

      process.exit(EXIT_CODE.APP_DEFINE_EXIT);
    }
  });

  await this.client.connect();
};

// eslint-disable-next-line no-unused-vars
SessionStorage.prototype.retry = async function () {
  /**
   * @link https://github.com/redis/node-redis#events
   */
  throw new Error(`
The Node Redis client class is an Nodejs EventEmitter and it emits an event each time the network status changes.

+--------------+---------------------------------------------+
|     Name     |                     When                    |
+--------------+---------------------------------------------+
|      ...     |                     ...                     |
+--------------+---------------------------------------------+
| reconnecting | Client is trying to reconnect to the server |
+--------------+---------------------------------------------+      
  `);
};

// TODO: 사용처는 모두 await을 사용하는데, async function이면 TypeError: client.get is not a function 에러가 나는가
SessionStorage.prototype.get = function () {
  return this.client;
};

module.exports = new SessionStorage();
