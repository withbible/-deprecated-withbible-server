const Pusher = require("pusher");

// INTERNAL IMPORT
const path = require("path");
const logger = require("./logger");
const BaseConfig = require("./base");

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
function PusherChannels() {
  BaseConfig.call(this);

  this.retry = () => {
    /**
     * @link https://pusher.com/docs/channels/using_channels/connection/#available-states
     * pusher-js will automatically retry the connection every 15 seconds.
     */
  };

  return {
    async init() {
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
    },

    get() {
      return this.pusher;
    },
  };
}

PusherChannels.prototype = Object.create(BaseConfig.prototype);
PusherChannels.prototype.constructor = PusherChannels;

module.exports = new PusherChannels();
