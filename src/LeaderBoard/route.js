module.exports = function (app) {
  const leaderBoard = require("./controller");

  // 사용자별 순위 전체조회 API
  app.get("/leader-board", leaderBoard.getLeaderBoard);

  // 사용자별 순위 부분조회 API
  app.get("/leader-board/page", leaderBoard.getLeaderBoardPage);

  // (테스트) 사용자별 순위 부분조회 마지막 페이징값 조회 API
  app.get("/leader-board/last-page", leaderBoard.getLeaderBoardLastPage);
};
