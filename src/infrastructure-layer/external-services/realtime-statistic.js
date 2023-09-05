const Pusher = require("pusher");

// INTERNAL IMPORT
const path = require("path");
const logger = require("../configs/logger");
const BaseThirdPartyConfig = require("./base");

// CONSTANT
const pusherConfig = {
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_SECREAT,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
};
const fileName = path.basename(__filename, ".js");

// MAIN
function RealtimeStatistic() {
  BaseThirdPartyConfig.call(this);
  this.pusher = null;
}

RealtimeStatistic.prototype = Object.create(BaseThirdPartyConfig.prototype);
RealtimeStatistic.prototype.constructor = RealtimeStatistic;

RealtimeStatistic.prototype.init = async function () {
  try {
    this.pusher = new Pusher(pusherConfig);
    await this.pusher.trigger(
      "quiz-interaction-channel",
      "quiz-interaction-event",
      {}
    );

    logger.info("Pusher Channels connected");
  } catch (err) {
    logger.error(`[${fileName}]_${err.message}`);
  }
};

// eslint-disable-next-line no-unused-vars
RealtimeStatistic.prototype.retry = async function () {
  /**
   * @link https://pusher.com/docs/channels/using_channels/connection/#available-states
   */
  throw new Error(
    "pusher-js will automatically retry the connection every 15 seconds"
  );
};

RealtimeStatistic.prototype.get = async function () {
  return this.pusher;
};

module.exports = new RealtimeStatistic();
