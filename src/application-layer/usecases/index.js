const bcypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

const makeLeaderBoardUsecase = require("./leader-board-usecase");
const makeUserUsecase = require("./user-usecase");
const makeHistoryUsecase = require("./history-usecase");
const makeQuizUsecase = require("./quiz-usecase");
const {
  leaderBoardRepository,
  userRepository,
  historyRepository,
  quizRepository,
} = require("../../data-access-layer/repositories");
const database = require("../../infrastructure-layer/external-services/database");

const leaderBoardUsecase = makeLeaderBoardUsecase({
  repository: leaderBoardRepository,
  StatusCodes,
});
const userUsecase = makeUserUsecase({
  userRepository,
  leaderBoardRepository,
  database,
  bcypt,
  StatusCodes,
});
const historyUsecase = makeHistoryUsecase({
  historyRepository,
  leaderBoardRepository,
  quizRepository,
  database,
  StatusCodes,
});
const quizUsecase = makeQuizUsecase({
  repository: quizRepository,
  database,
  StatusCodes,
});

module.exports = Object.freeze({
  leaderBoardUsecase,
  userUsecase,
  historyUsecase,
  quizUsecase,
});
