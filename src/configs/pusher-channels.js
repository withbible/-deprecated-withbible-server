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
const pusherChannelsPromise = (async () => {
  try {
    const pusher = new Pusher(pusherConfig);
    await pusher.trigger(
      "quiz-interaction-channel",
      "quiz-interaction-event",
      {}
    );

    logger.info("Pusher Channels connected");
    return pusher;
  } catch (err) {
    logger.error(`[${fileName}]_${err.message}`);
  }
})();

module.exports = pusherChannelsPromise;
