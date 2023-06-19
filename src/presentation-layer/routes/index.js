const makeLeaderBoardRoute = require("./leader-board-route");
const makeUserRoute = require("./user-route");
const makeHistoryRoute = require("./history-route");
const makeQuizRoute = require("./quiz-route");
const {
  leaderBoardController,
  userController,
  historyController,
  quizController,
} = require("../controllers");
const { checkSessionCookie } = require("../middlewares/authenticator");
const { checkQuizDomain, checkCache } = require("../middlewares/validator");

module.exports = (app) => {
  makeLeaderBoardRoute(app, leaderBoardController);
  makeQuizRoute(app, quizController, checkQuizDomain, checkCache);
  makeUserRoute(app, userController, checkSessionCookie);
  makeHistoryRoute(app, historyController, checkSessionCookie, checkQuizDomain);
};
