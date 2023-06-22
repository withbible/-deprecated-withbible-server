const makeLeaderBoardController = require("./leader-board-controller");
const makeUserController = require("./user-controller");
const makeHistoryController = require("./history-controller");
const makeQuizController = require("./quiz-controller");
const {
  leaderBoardUsecase,
  userUsecase,
  historyUsecase,
  quizUsecase,
} = require("../../application-layer/usecases");
const sessionStorage = require("../../infrastructure-layer/external-services/session-storage");
const realtimeStatistic = require("../../infrastructure-layer/external-services/realtime-statistic");

const leaderBoardController = makeLeaderBoardController(leaderBoardUsecase);
const userController = makeUserController(userUsecase);
const historyController = makeHistoryController(
  historyUsecase,
  realtimeStatistic
);
const quizController = makeQuizController(quizUsecase, sessionStorage);

module.exports = Object.freeze({
  leaderBoardController,
  userController,
  historyController,
  quizController,
});
