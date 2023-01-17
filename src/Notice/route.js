module.exports = function (app) {
  const notice = require("./controller");

  // FCM 토큰 조회 API
  app.get("/notice/token", notice.getToken);
};
