const Pusher = require("pusher");

// INTERNAL IMPORT
const path = require("path");
const logger = require("./logger");

// CONSTANT
const fileName = path.basename(__filename, ".js");

// CONFIG
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_SECREAT,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

// MAIN
(async function () {
  try {
    await pusher.trigger(
      "quiz-interaction-channel",
      "quiz-interaction-event",
      {}
    );

    logger.info("Pusher Channels connected");
  } catch (err) {
    logger.error(`[${fileName}]_${err.message}`);
  }
})();

module.exports = pusher;
