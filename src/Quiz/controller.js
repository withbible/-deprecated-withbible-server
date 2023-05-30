const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const path = require("path");
const logger = require("../configs/logger");
const client = require("../configs/session-storage").getClient();
const docs = require("../constants/docs");
const { CATEGORY, QUIZ_API_DOCS } = require("../constants");
const { response, errResponse } = require("../utils/response");
const { filterReferenceOther } = require("../utils");
const provider = require("./provider");
const service = require("./service");

// CONSTANT
const dirName = path.basename(__dirname);

exports.getChapter = async (req, res) => {
  const { keyword } = req.query;

  try {
    const result = await provider.getChapter(keyword);

    res.json(
      response({
        message: "카테고리별 검색어를 포함한 챕터수 조회 완료",
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: docs["GET.CHAPTER"],
      })
    );
  }
};

exports.getQuiz = async (req, res) => {
  const { categorySeq, chapterNum } = req.query;

  try {
    const result = await provider.getQuiz(categorySeq, chapterNum);

    const cachingKey = `quiz:${categorySeq}-${chapterNum}`;
    await client.set(cachingKey, JSON.stringify(result));
    await client.expire(cachingKey, 3600);

    res.json(
      response({
        message: "한 챕터의 질문-선택지 전체조회 완료",
        meta: {
          category: CATEGORY[categorySeq],
          categorySeq,
          chapterNum,
        },
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: docs["GET.QUIZ"],
      })
    );
  }
};

exports.postQuiz = async (req, res) => {
  const { categorySeq, question, questionSub, optionArray } = req.body;

  try {
    const result = await service.postQuiz(
      categorySeq,
      question,
      questionSub,
      optionArray
    );

    res.status(StatusCodes.CREATED);
    res.json(
      response({
        message: "퀴즈 생성 완료",
        meta: {
          links: filterReferenceOther(QUIZ_API_DOCS, req.method),
          ...result,
        },
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: docs["POST.QUIZ"],
      })
    );
  }
};

exports.putQuiz = async (req, res) => {
  const { questionSeq, question, questionSub, optionArray } = req.body;

  try {
    const result = await service.putQuiz(
      questionSeq,
      question,
      questionSub,
      optionArray
    );

    res.json(
      response({
        message: "퀴즈 수정 완료",
        meta: {
          links: filterReferenceOther(QUIZ_API_DOCS, req.method),
          ...result,
        },
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: docs["PUT.QUIZ"],
      })
    );
  }
};
