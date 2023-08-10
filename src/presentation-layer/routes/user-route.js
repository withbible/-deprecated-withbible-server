module.exports = ({ express, controller, checkSessionCookie }) => {
  const router = express.Router();

  // 회원 가입 API
  router.post("/", controller.signup);

  // 로그인 API
  router.patch("/login", controller.login);

  // 로그인 여부 확인 API
  router.get("/login-check", checkSessionCookie, controller.loginCheck);

  // 로그아웃 API
  router.patch("/logout", checkSessionCookie, controller.logout);

  return router;
};
