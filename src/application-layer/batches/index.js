const makeNoticeBatch = require("./notice-batch");
const { quizRepository } = require("../../data-access-layer/repositories");
const pushNotification = require("../../infrastructure-layer/external-services/push-notification");

const noticeBatch = makeNoticeBatch(quizRepository, pushNotification);

module.exports = Object.freeze({
  noticeBatch,
});
