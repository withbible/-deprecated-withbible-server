module.exports = (app, controller, checkSessionCookie) => {
  // 회원 가입 API
  app.post("/user", controller.signup);

  // 로그인 API
  app.patch("/user/login", controller.login);

  // 로그인 여부 확인 API
  app.get("/user/login-check", checkSessionCookie, controller.loginCheck);

  // 로그아웃 API
  app.patch("/user/logout", checkSessionCookie, controller.logout);
};
