const Pusher = require("pusher");

// INTERNAL IMPORT
const path = require("path");
const logger = require("./logger");

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
class PusherChannels {
  static async init() {
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
  }

  static getPusherChannels() {
    return this.pusher;
  }
}

module.exports = PusherChannels;
