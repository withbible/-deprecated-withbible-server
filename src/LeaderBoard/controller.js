// INTERNAL IMPORT
const path = require("path");
const logger = require("../configs/logger");
const { response, errResponse } = require("../modules/response");
const provider = require("./provider");
const docs = require("../constants/docs");

// CONSTANT
const dirName = path.basename(__dirname);

exports.getLeaderBoard = async function (req, res) {
  try {
    const result = await provider.getLeaderBoard();

    res.json(response({ message: "사용자별 순위 전체조회 완료", result }));
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({ message: err.message, link: docs["GET.LEADER-BOARD"] })
    );
  }
};

exports.getLeaderBoardPage = async function (req, res) {
  const { limit, page } = req.query;

  try {
    const totalCount = await provider.getTotalCount();
    const lastPage = Math.ceil(totalCount / limit);
    const result = await provider.getLeaderBoardPage(limit, page, lastPage);

    res.json(
      response({
        message: "사용자별 순위 부분조회 완료",
        meta: {
          links: [
            {
              rel: "self",
              link: req.url,
            },
            {
              rel: "last",
              link: req.url.replace(/\d$/, lastPage),
            },
          ],
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
        link: docs["GET.LEADER-BOARD-PAGE"],
      })
    );
  }
};

exports.getLeaderBoardLastPage = async function (req, res) {
  const { limit } = req.query;

  try {
    const totalCount = await provider.getTotalCount();
    const result = Math.ceil(totalCount / limit);

    res.json(
      response({
        message: "사용자별 순위 부분조회 마지막 페이징값 조회 완료",
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
      })
    );
  }
};
