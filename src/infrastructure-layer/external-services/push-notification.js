const PushNotifications = require("@pusher/push-notifications-server");

// INTERNAL IMPORT
const path = require("path");
const logger = require("../configs/logger");
const BaseExternalService = require("./base");

// CONSTANT
const config = {
  instanceId: process.env.PUSHER_BEAMS_INSTANCE_ID,
  secretKey: process.env.PUSHER_BEAMS_PRIMARY_KEY,
};
const fileName = path.basename(__filename, ".js");

// MAIN
function PushNotification() {
  BaseExternalService.call(this);
  this.client = null;
}

PushNotification.prototype = Object.create(BaseExternalService.prototype);
PushNotification.prototype.constructor = PushNotification;

PushNotification.prototype.initPromisify = async function (config) {
  return Promise.resolve(new PushNotifications(config));
};

PushNotification.prototype.init = async function () {
  try {
    this.client = await this.initPromisify(config);

    logger.info("Pusher Beams connected");
  } catch (err) {
    logger.error(`[${fileName}]_${err.message}`);
  }
};

// eslint-disable-next-line no-unused-vars
PushNotification.prototype.retry = async function () {
  /**
   * @link https://pusher.com/docs/beams/concepts/webhooks/?_gl=1*10b0ewk*_gcl_au*NTU3MjY4NDk0LjE2ODU0MjA5NDEuMTUzNDg2MzA1OC4xNjg1OTQ2MjkyLjE2ODU5NDYyOTI.#retry-strategy
   */
  throw new Error(
    "If your server fails to reply with the expected response, we will retry the webhook request up to four times – first after 10 seconds, then a further 30 seconds, a further 120 seconds, and finally a further 300 seconds."
  );
};

PushNotification.prototype.get = async function () {
  return this.client;
};

module.exports = new PushNotification();
