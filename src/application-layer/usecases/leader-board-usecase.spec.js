require("dotenv").config();
const { expect } = require("chai");
const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const makeLeaderBoardUseCase = require("./leader-board-usecase");
const {
  leaderBoardRepository,
} = require("../../data-access-layer/repositories");
const database = require("../../infrastructure-layer/external-services/database");

describe("사용자별 순위 도메인", () => {
  let usecase;

  before(async () => {
    await database.init();

    usecase = makeLeaderBoardUseCase(leaderBoardRepository);
  });

  it("사용자별 순위 전체조회", async () => {
    const selected = await usecase.getLeaderBoard();

    expect(selected).to.be.instanceOf(Array);
    expect(selected).to.have.length.above(0);
  });

  it("사용자별 순위 부분조회", async () => {
    const totalCount = await usecase.getTotalCount();
    const limit = 11;
    const page = 1;
    const lastPage = Math.ceil(totalCount / limit);

    const selected = await usecase.getLeaderBoardPage(limit, page, lastPage);

    expect(selected).to.be.instanceOf(Array);
    expect(selected).to.have.length.above(0);
  });

  it("사용자별 순위 부분조회 (마지막 페이지)", async () => {
    const totalCount = await usecase.getTotalCount();
    const limit = 11;
    const lastPage = Math.ceil(totalCount / limit);

    const selected = await usecase.getLeaderBoardPage(
      limit,
      lastPage,
      lastPage
    );

    expect(selected).to.be.instanceOf(Array);
    expect(selected).to.have.length.above(0);
  });

  it("사용자별 순위 부분조회 (유효하지 않은 인자값)", async () => {
    const totalCount = await usecase.getTotalCount();
    const limit = 11;
    const lastPage = Math.ceil(totalCount / limit);

    try {
      await usecase.getLeaderBoardPage(limit, lastPage + 1, lastPage);
    } catch (err) {
      expect(err.status).to.equal(StatusCodes.BAD_REQUEST);
    }
  });
});
