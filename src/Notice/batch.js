const path = require("path");
const logger = require("../configs/logger");
const provider = require("./provider");

// CONSTANT
const dirName = path.basename(__dirname);

exports.sendQuizNotification = async () => {
  const [createdCountResponse, client] = await Promise.all([
    provider.getCreatedCountByPrevMonth(),
    require("../configs/push-notification").get(),
  ]);

  const body = createdCountResponse
    ? `${createdCountResponse.createdCount}개의 새로운 퀴즈가 등록되었습니다.`
    : "새로운 퀴즈가 등록되지 않았습니다.";

  try {
    const message = {
      title: "전월 퀴즈 등록수 알림",
      body,
      image: `${process.env.CLOUD_GUEST_SWYG}/images/logo.png`,
    };

    const response = await client.publishToInterests(
      ["quizCreatedCountByPrevMonth"],
      {
        apns: {
          aps: {
            alert: message,
          },
        },
        fcm: {
          notification: message,
        },
        web: {
          notification: message,
        },
      }
    );

    console.log(response);

    logger.info(`전월 퀴즈 등록수 알림 송신`);
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
  }
};
