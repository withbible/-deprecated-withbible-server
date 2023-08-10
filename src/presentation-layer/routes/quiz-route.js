module.exports = ({
  express,
  controller,
  checkSessionCookie,
  checkQuizQueryString,
  checkQuizCache,
}) => {
  const router = express.Router();

  // 카테고리별 검색어를 포함한 챕터수 조회 API
  router.get("/categories/chapter", controller.getChapter);

  // 한 챕터의 질문-선택지 전체조회 API
  router.get(
    "/chapter",
    [checkQuizQueryString, checkQuizCache],
    controller.getQuiz
  );

  // (관리자) 질문-선택지-정답여부 생성 API
  router.post("/", checkSessionCookie, controller.postQuiz);

  // (관리자) 질문-선택지-정답여부 수정 API
  router.put("/", checkSessionCookie, controller.putQuiz);

  return router;
};
