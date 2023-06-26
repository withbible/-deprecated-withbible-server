const sessionStorage = require("../../infrastructure-layer/external-services/session-storage");
const { response } = require("../../utils/response");

module.exports = async (req, res, next) => {
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
};
