const util = require("util");
const path = require("path");
const logger = require("../configs/logger");
const provider = require("./provider");
const admin = require("../configs/firebase-messaging-admin");

// CONSTANT
const dirName = path.basename(__dirname);

exports.sendQuizNotification = async function () {
  const { createdCount } = await provider.getCreatedCountByPrevMonth();
  const tokens = await provider.getToken();

  try {
    const message = {
      notification: {
        title: "전월 퀴즈 등록수 알림",
        body: `${createdCount}개의 새로운 퀴즈가 등록되었습니다.`,
        image: `${process.env.CLOUD_GUEST}/images/logo.png`,
      },
      tokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    logger.info(util.inspect(response, { showHidden: false, depth: null }));
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
  }
};
