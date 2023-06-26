const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const { CATEGORY } = require("../../infrastructure-layer/constants");
const { errResponse } = require("../../utils/response");
const { quizRepository } = require("../../data-access-layer/repositories");

// HELPER FUNCTION
function makeSequence(length) {
  return [...Array(length)].map((_, index) => index + 1);
}

module.exports = async (req, res, next) => {
  const { categorySeq, chapterNum } = req.query;

  if (!categorySeq || !CATEGORY[categorySeq]) {
    const message = "유효한 카테고리일련번호(categorySeq)를 입력해주세요.";

    res.status(StatusCodes.BAD_REQUEST);
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

    res.status(StatusCodes.BAD_REQUEST);
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
};
