const path = require("path");
const logger = require("../configs/logger");
const provider = require("./provider");
const messagingPromise = require("../configs/firebase-messaging-admin");

// CONSTANT
const dirName = path.basename(__dirname);

exports.sendQuizNotification = async () => {
  const [createdCountResponse, tokens, messaging] = await Promise.all([
    provider.getCreatedCountByPrevMonth(),
    provider.getToken(),
    messagingPromise,
  ]);

  const body = createdCountResponse
    ? `${createdCountResponse.createdCount}개의 새로운 퀴즈가 등록되었습니다.`
    : "새로운 퀴즈가 등록되지 않았습니다.";

  try {
    const message = {
      notification: {
        title: "전월 퀴즈 등록수 알림",
        body,
        image: `${process.env.CLOUD_GUEST_SWYG}/images/logo.png`,
      },
      tokens,
    };

    const response = await messaging.sendEachForMulticast(message);
    logger.info(
      `전월 퀴즈 등록수 알림 송신 | 성공: ${response.successCount} | 실패: ${response.failureCount}`
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
  }
};
