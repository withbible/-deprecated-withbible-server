const util = require("util");
const path = require("path");
const { logger } = require("../configs/logger");
const quizProvider = require("../Quiz/provider");
const noticeProvider = require("./provider");
const admin = require("../configs/firebase-messaging-admin");

// CONSTANT
const dirName = path.basename(__dirname);

// HELPER FUNCTION
function getLastMonth() {
  const date = new Date();

  date.setDate(date.getMonth() - 1);
  return [date.getFullYear(), date.getMonth() + 1];
}

exports.sendQuizNotification = async function () {
  const [year, month] = getLastMonth();
  const [createdCount] = await quizProvider.getCreatedCount(year, month);
  const tokens = await noticeProvider.getToken();

  try {
    const message = {
      notification: {
        title: "전월 퀴즈 등록수 알림",
        body: `${
          createdCount?.totalCount || 0
        }개의 새로운 퀴즈가 등록되었습니다.`,
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
