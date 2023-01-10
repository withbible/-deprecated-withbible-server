const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const { errResponse } = require("../modules/response");
const { CATEGORY } = require("../constants/enum");
const { getMaxChapterByCategory } = require("../Quiz/provider");

function makeSequence(length) {
  return [...Array(length)].map((_, index) => index + 1);
}

module.exports = {
  authenticate: (req, res, next) => {
    if (!req.session || !req.session.user) {
      res.status(StatusCodes.UNAUTHORIZED);
      return res.json(errResponse({ message: "권한이 없습니다." }));
    }

    return next();
  },

  quiz: async (req, res, next) => {
    const { categorySeq, chapterNum } = req.query;

    if (!categorySeq || !CATEGORY[categorySeq]) {
      const message = "카테고리일련번호(categorySeq)를 입력해주세요.";

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

    if (!chapterNum) {
      const message = "챕터번호(chapterNum)를 입력해주세요.";
      const { maxChapterNum } = await getMaxChapterByCategory(categorySeq);

      res.status(StatusCodes.BAD_REQUEST);
      return res.json(
        errResponse({
          message,
          meta: {
            chapterNumArray: makeSequence(maxChapterNum),
          },
        })
      );
    }

    return next();
  },
};
