module.exports = function (app) {
  const user = require('./controller');

  app.patch('/user/login', user.login);
};