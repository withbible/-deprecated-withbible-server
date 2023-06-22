const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const path = require("path");
const logger = require("../../infrastructure-layer/configs/logger");
const docs = require("../../infrastructure-layer/constants/api-docs");
const { CATEGORY } = require("../../infrastructure-layer/constants");
const { response, errResponse } = require("../../utils/response");
const { filterReferenceOther } = require("../../utils");

// CONSTANT
const fileName = path.basename(__filename, ".js");

module.exports = (usecase, sessionStorage) => {
  return Object.freeze({
    getChapter,
    getQuiz,
    postQuiz,
    putQuiz,
  });

  async function getChapter(req, res) {
    const { keyword } = req.query;

    try {
      const result = await usecase.getChapter(keyword);

      res.json(
        response({
          message: "카테고리별 검색어를 포함한 챕터수 조회 완료",
          result,
        })
      );
    } catch (err) {
      logger.warn(`[${fileName}]_${err.message}`);

      res.status(err.status);
      res.json(
        errResponse({
          message: err.message,
          link: docs["GET.CHAPTER"],
        })
      );
    }
  }

  async function getQuiz(req, res) {
    const { categorySeq, chapterNum } = req.query;

    try {
      const [result, client] = await Promise.all([
        usecase.getQuiz(categorySeq, chapterNum),
        sessionStorage.get(),
      ]);

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
      logger.warn(`[${fileName}]_${err.message}`);

      res.status(err.status);
      res.json(
        errResponse({
          message: err.message,
          link: docs["GET.QUIZ"],
        })
      );
    }
  }

  async function postQuiz(req, res) {
    const { categorySeq, question, questionSub, optionArray } = req.body;

    try {
      const result = await usecase.postQuiz(
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
            links: filterReferenceOther(docs.QUIZ_API_DOCS, req.method),
            ...result,
          },
        })
      );
    } catch (err) {
      logger.warn(`[${fileName}]_${err.message}`);

      res.status(err.status);
      res.json(
        errResponse({
          message: err.message,
          link: docs["POST.QUIZ"],
        })
      );
    }
  }

  async function putQuiz(req, res) {
    const { questionSeq, question, questionSub, optionArray } = req.body;

    try {
      const result = await usecase.putQuiz(
        questionSeq,
        question,
        questionSub,
        optionArray
      );

      res.json(
        response({
          message: "퀴즈 수정 완료",
          meta: {
            links: filterReferenceOther(docs.QUIZ_API_DOCS, req.method),
            ...result,
          },
        })
      );
    } catch (err) {
      logger.warn(`[${fileName}]_${err.message}`);

      res.status(err.status);
      res.json(
        errResponse({
          message: err.message,
          link: docs["PUT.QUIZ"],
        })
      );
    }
  }
};
