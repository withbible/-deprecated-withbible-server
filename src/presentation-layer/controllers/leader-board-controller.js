module.exports = ({ usecase, logger, path, docs, response, errResponse }) => {
  const fileName = path.basename(__filename, ".js");

  return Object.freeze({
    getLeaderBoard,
    getLeaderBoardPage,
    getLeaderBoardLastPage,
  });

  async function getLeaderBoard(req, res) {
    try {
      const result = await usecase.getLeaderBoard();

      res.json(response({ message: "사용자별 순위 전체조회 완료", result }));
    } catch (err) {
      logger.warn(`[${fileName}]_${err.message}`);

      res.status(err.status);
      res.json(
        errResponse({ message: err.message, link: docs["GET.LEADER-BOARD"] })
      );
    }
  }

  async function getLeaderBoardPage(req, res) {
    const { limit, page } = req.query;

    try {
      const totalCount = await usecase.getTotalCount();
      const lastPage = Math.ceil(totalCount / limit);
      const result = await usecase.getLeaderBoardPage(limit, page, lastPage);

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
      logger.warn(`[${fileName}]_${err.message}`);

      res.status(err.status);
      res.json(
        errResponse({
          message: err.message,
          link: docs["GET.LEADER-BOARD-PAGE"],
        })
      );
    }
  }

  async function getLeaderBoardLastPage(req, res) {
    const { limit } = req.query;

    try {
      const totalCount = await usecase.getTotalCount();
      const result = Math.ceil(totalCount / limit);

      res.json(
        response({
          message: "사용자별 순위 부분조회 마지막 페이징값 조회 완료",
          result,
        })
      );
    } catch (err) {
      logger.warn(`[${fileName}]_${err.message}`);

      res.status(err.status);
      res.json(
        errResponse({
          message: err.message,
        })
      );
    }
  }
};
