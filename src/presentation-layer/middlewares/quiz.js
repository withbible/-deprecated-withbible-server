module.exports = ({
  quizRepository,
  sessionStorage,
  CATEGORY,
  statusCodes,
  response,
  errResponse,
}) => {
  return Object.freeze({
    checkQuizCache,
    checkQuizQueryString,
  });

  async function checkQuizCache(req, res, next) {
    const { categorySeq, chapterNum } = req.query;

    const client = await sessionStorage.get();
    const cached = await client.get(`quiz:${categorySeq}-${chapterNum}`);
    const result = JSON.parse(cached);

    if (result) {
      return res.json(
        response({
          message: "한 챕터의 질문-선택지 전체조회 완료",
          result,
        })
      );
    }

    return next();
  }

  function makeSequence(length) {
    return [...Array(length)].map((_, index) => index + 1);
  }

  async function checkQuizQueryString(req, res, next) {
    const { categorySeq, chapterNum } = req.query;

    if (!categorySeq || !CATEGORY[categorySeq]) {
      const message = "유효한 카테고리일련번호(categorySeq)를 입력해주세요.";

      res.status(statusCodes.BAD_REQUEST);
      return res.json(
        errResponse({
          message,
          meta: {
            categories: CATEGORY,
          },
        })
      );
    }

    const [{ maxChapterNum }] = await quizRepository.selectMaxChapterByCategory(
      categorySeq
    );
    const chapterNumArray = makeSequence(maxChapterNum);
    const chapterNumIndex = chapterNum - 1;

    if (!chapterNum || !(chapterNumIndex in chapterNumArray)) {
      const message = "유효한 챕터번호(chapterNum)를 입력해주세요.";

      res.status(statusCodes.BAD_REQUEST);
      return res.json(
        errResponse({
          message,
          meta: {
            chapterNumArray,
          },
        })
      );
    }

    return next();
  }
};
