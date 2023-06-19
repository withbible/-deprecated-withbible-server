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

const leaderBoardUsecase = makeLeaderBoardUsecase(leaderBoardRepository);
const userUsecase = makeUserUsecase(
  userRepository,
  leaderBoardRepository,
  database
);
const historyUsecase = makeHistoryUsecase(
  historyRepository,
  leaderBoardRepository,
  quizRepository,
  database
);
const quizUsecase = makeQuizUsecase(quizRepository, database);

module.exports = Object.freeze({
  leaderBoardUsecase,
  userUsecase,
  historyUsecase,
  quizUsecase,
});
