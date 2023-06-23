const cron = require("node-cron");

// INTERNAL IMPORT
const makeNoticeBatch = require("./notice-batch");
const makeDatabaseBatch = require("./database-batch");
const { quizRepository } = require("../../data-access-layer/repositories");
const pushNotification = require("../../infrastructure-layer/external-services/push-notification");
const database = require("../../infrastructure-layer/external-services/database");

const noticeBatch = makeNoticeBatch(quizRepository, pushNotification);
const databaseBatch = makeDatabaseBatch(database);

const run = () => {
  cron.schedule("0 9 1 * *", async () => {
    await noticeBatch.sendQuizNotification();
  });

  cron.schedule("* */1 * * *", async () => {
    await databaseBatch.checkConnection();
  });
};

module.exports = Object.freeze({
  run,
});
