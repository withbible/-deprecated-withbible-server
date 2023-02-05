const redis = require("redis");

// INTERNAL IMPORT
const path = require("path");
const { logger } = require("./logger");

// CONSTANT
const fileName = path.basename(__filename, ".js");

// CONFIG
const client = redis.createClient({
  url: process.env.REDIS_URI,
  legacyMode: true,
});

// MAIN
(async function () {
  try {
    await client.connect();

    logger.info("Redis connected");
  } catch (err) {
    logger.error(`[${fileName}]_${err.message}`);
  }
})();

module.exports = client;
