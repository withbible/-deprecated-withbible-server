const PushNotifications = require("@pusher/push-notifications-server");

// INTERNAL IMPORT
const logger = require("../configs/logger");
const BaseThirdPartyConfig = require("./base");
const { MAX_RETRY_ATTEMPTS } = require("../constants");
const { sleep, getBackOff } = require("../../utils");

// CONSTANT
const config = {
  instanceId: process.env.PUSHER_BEAMS_INSTANCE_ID,
  secretKey: process.env.PUSHER_BEAMS_PRIMARY_KEY,
};

// MAIN
function PushNotification() {
  BaseThirdPartyConfig.call(this);

  return {
    init,
    get,
  };

  async function initPromisfy(config) {
    return Promise.resolve(new PushNotifications(config));
  }

  async function init() {
    try {
      this.client = await initPromisfy(config);

      logger.info("Pusher Beams connected");
    } catch (err) {
      retry();
    }
  }

  async function retry(attempts = 1) {
    try {
      this.client.checkConnection();
    } catch (err) {
      if (attempts > MAX_RETRY_ATTEMPTS) {
        logger.error(
          `Unable to connect to Pusher Beams in ${attempts} attempts, exiting`
        );
        process.exit(1);
      }

      const backoff = getBackOff(attempts);
      logger.warn(`Unable to connect to Pusher Beams, trying again in ${backoff}ms
      `);

      await sleep(backoff);
      return retry(attempts + 1);
    }
  }

  function get() {
    return this.client;
  }
}

PushNotification.prototype = Object.create(BaseThirdPartyConfig.prototype);
PushNotification.prototype.constructor = PushNotification;

module.exports = new PushNotification();
