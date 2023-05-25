const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const { errResponse } = require("../utils/response");
const { CATEGORY } = require("../constants/enum");
const { getMaxChapterByCategory } = require("../Quiz/provider");

// HELPER FUNCTION
function makeSequence(length) {
  return [...Array(length)].map((_, index) => index + 1);
}

// MAIN
const checkQuizDomain = async (req, res, next) => {
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

  const { maxChapterNum } = await getMaxChapterByCategory(categorySeq);
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

module.exports = checkQuizDomain;
