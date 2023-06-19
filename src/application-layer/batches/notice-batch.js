const path = require("path");
const logger = require("../../infrastructure-layer/configs/logger");

// CONSTANT
const fileName = path.basename(__filename, ".js");

module.exports = (repository, pushNotification) => {
  return Object.freeze({
    sendQuizNotification,
  });

  async function sendQuizNotification() {
    const [[createdCountRow], client] = await Promise.all([
      repository.selectCreatedCountByPrevMonth(),
      pushNotification.get(),
    ]);

    const publishFormat = {
      title: `${createdCountRow.date}월 퀴즈 등록수 알림`,
      body: createdCountRow
        ? `${createdCountRow.createdCount}개의 새로운 퀴즈가 등록되었습니다.`
        : "새로운 퀴즈가 등록되지 않았습니다.",
      icon: `${process.env.CLOUD_GUEST}/images/logo.png`,
    };

    const publishBody = {
      apns: {
        aps: {
          alert: publishFormat,
        },
      },
      fcm: {
        notification: publishFormat,
      },
      web: {
        notification: publishFormat,
      },
    };

    try {
      await client.publishToInterests(
        ["quizCreatedCountByPrevMonth"],
        publishBody
      );

      logger.info(`Pusher Beams 송신 내용: ${JSON.stringify(publishFormat)}`);
    } catch (err) {
      logger.warn(`[${fileName}]_${err.message}`);
    }
  }
};
