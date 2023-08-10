module.exports = ({ express, controller }) => {
  const router = express.Router();

  // 사용자별 순위 전체조회 API
  router.get("/", controller.getLeaderBoard);

  // 사용자별 순위 부분조회 API
  router.get("/page", controller.getLeaderBoardPage);

  // (테스트) 사용자별 순위 부분조회 마지막 페이징값 조회 API
  router.get("/last-page", controller.getLeaderBoardLastPage);

  return router;
};
