const util = require("util");
const path = require("path");
const { logger } = require("../configs/logger");
const quizProvider = require("../Quiz/provider");
const noticeProvider = require("./provider");
const admin = require("../configs/firebase-messaging-admin");

// CONSTANT
const dirName = path.basename(__dirname);

exports.sendQuizNotification = async function () {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  const [createdCount] = await quizProvider.getCreatedCount(year, month);
  const tokens = await noticeProvider.getToken();

  try {
    const message = {
      notification: {
        title: "금월 퀴즈 등록수 알림",
        body: String(createdCount.totalCount),
        image:
          process.env.NODE_ENV === "development"
            ? `${process.env.LOCAL_HOST}/images/logo.png`
            : `${process.env.CLOUD_HOST}/images/logo.png`,
      },
      tokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    logger.info(util.inspect(response, { showHidden: false, depth: null }));
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
  }
};
