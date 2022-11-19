module.exports = function (app) {
  const user = require('./controller');

  // 유저 생성 (회원가입) API
  app.post('/users', user.postUsers);

  // 로그인 API
  app.patch('/users/login', user.login);

  // 자동로그인 API
  app.get('/users/loginCheck', user.loginCheck);

  // 로그아웃 API
  app.patch('/users/logout', user.logout);
};