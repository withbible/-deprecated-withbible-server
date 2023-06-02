const PushNotifications = require("@pusher/push-notifications-server");

// INTERNAL IMPORT
const path = require("path");
const logger = require("./logger");
const BaseThirdPartyConfig = require("./base");

// CONSTANT
const config = {
  instanceId: process.env.PUSHER_BEAMS_INSTANCE_ID,
  secretKey: process.env.PUSHER_BEAMS_PRIMARY_KEY,
};
const fileName = path.basename(__filename, ".js");

// MAIN
function PushNotification() {
  BaseThirdPartyConfig.call(this);

  // this.retry = () => { };

  const initPushNotificationsPromisify = async (config) => {
    return Promise.resolve(new PushNotifications(config));
  };

  return {
    async init() {
      try {
        this.client = await initPushNotificationsPromisify(config);

        logger.info("Pusher Beams connected");
      } catch (err) {
        logger.error(`[${fileName}]_${err.message}`);
      }
    },

    get() {
      return this.client;
    },
  };
}

PushNotification.prototype = Object.create(BaseThirdPartyConfig.prototype);
PushNotification.prototype.constructor = PushNotification;

module.exports = new PushNotification();
