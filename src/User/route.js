const { checkSessionCookie } = require("../middlewares/authenticator");

module.exports = (app) => {
  const user = require("./controller");

  // 유저 생성 (회원가입) API
  app.post("/user", user.postUser);

  // 로그인 API
  app.patch("/user/login", user.login);

  // 로그인여부 확인 API
  app.get("/user/login-check", checkSessionCookie, user.loginCheck);

  // 로그아웃 API
  app.patch("/user/logout", checkSessionCookie, user.logout);
};
