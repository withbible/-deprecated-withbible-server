const Sentry = require("@sentry/node");

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
const { CATEGORY } = require("../../infrastructure-layer/constants");

const defaultArgController = Object.freeze({
  StatusCodes: require("http-status-codes"),
  logger: require("../../infrastructure-layer/configs/logger"),
  path: require("path"),
  filterReferenceOther: require("../../utils").filterReferenceOther,
  docs: require("../../infrastructure-layer/constants/api-docs"),
  response: require("../../utils/response").response,
  errResponse: require("../../utils/response").errResponse,
});

const leaderBoardController = makeLeaderBoardController({
  usecase: leaderBoardUsecase,
  ...defaultArgController,
});
const userController = makeUserController({
  usecase: userUsecase,
  ...defaultArgController,
});
const historyController = makeHistoryController({
  usecase: historyUsecase,
  realtimeStatistic,
  CATEGORY,
  Sentry,
  ...defaultArgController,
});
const quizController = makeQuizController({
  usecase: quizUsecase,
  sessionStorage,
  CATEGORY,
  ...defaultArgController,
});

module.exports = Object.freeze({
  leaderBoardController,
  userController,
  historyController,
  quizController,
});
