const { StatusCodes } = require("http-status-codes");

module.exports = (repository) => {
  return Object.freeze({
    getLeaderBoard,
    getLeaderBoardPage,
    getTotalCount,
  });

  async function getLeaderBoard() {
    const result = await repository.selectAll();

    if (!result.length) {
      const err = new Error("데이터가 존재하지 않습니다.");
      err.status = StatusCodes.BAD_REQUEST;
      return Promise.reject(err);
    }

    return Promise.resolve(result);
  }

  async function getLeaderBoardPage(limit, page, lastPage) {
    if (!limit || !page || page > lastPage) {
      const err = new Error("데이터가 존재하지 않습니다.");
      err.status = StatusCodes.BAD_REQUEST;
      return Promise.reject(err);
    }

    const offset = (page - 1) * limit;
    const result = await repository.selectPage(limit, offset);

    return Promise.resolve(result);
  }

  async function getTotalCount() {
    const [rows] = await repository.selectTotalCount();
    const result = rows.totalCount;

    return Promise.resolve(result);
  }
};
