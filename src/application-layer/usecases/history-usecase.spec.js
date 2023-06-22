require("dotenv").config();
const { expect } = require("chai");
const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const makeHistoryUsecase = require("./history-usecase");
const {
  leaderBoardRepository,
  historyRepository,
  quizRepository,
} = require("../../data-access-layer/repositories");
const database = require("../../infrastructure-layer/external-services/database");

// CONSTANT
const userSeq = process.env.TEST_USER_SEQ;
const categorySeq = 1;
const chapterNum = 3;
const userOption = {
  7: 25,
  8: 29,
  9: 33,
};
const limit = 11;

describe("사용자 기록 도메인", () => {
  let usecase;

  before(async () => {
    await database.init();

    usecase = makeHistoryUsecase(
      historyRepository,
      leaderBoardRepository,
      quizRepository,
      database
    );
  });

  it("한 챕터의 선택기록 생성", async () => {
    await usecase.postUserOption(categorySeq, chapterNum, userSeq, userOption);
  });

  it("한 챕터의 선택기록 생성 (중복된 기록)", async () => {
    try {
      await usecase.postUserOption(
        categorySeq,
        chapterNum,
        userSeq,
        userOption
      );
    } catch (err) {
      expect(err.status).to.equal(StatusCodes.METHOD_NOT_ALLOWED);
    }
  });

  it("한 챕터의 선택기록 조회", async () => {
    const selected = await usecase.getUserOption(
      categorySeq,
      chapterNum,
      userSeq
    );

    expect(selected).to.be.instanceOf(Array);
    expect(selected).to.have.length.above(0);
  });

  it("한 챕터의 선택기록 조회 (유효하지 않은 인자값)", async () => {
    try {
      await usecase.getUserOption(categorySeq, chapterNum, 0);
    } catch (err) {
      expect(err.status).to.equal(StatusCodes.BAD_REQUEST);
    }
  });

  it("한 챕터의 선택기록 수정 (변경된 요소 존재하지 않음)", async () => {
    const status = await usecase.putUserOption(
      categorySeq,
      chapterNum,
      userSeq,
      userOption
    );

    expect(status).to.equal(StatusCodes.NO_CONTENT);
  });

  it("한 챕터의 선택기록 수정 (변경된 요소 존재)", async () => {
    const newUserOption = { ...userOption, ...{ 9: 34 } };

    const status = await usecase.putUserOption(
      categorySeq,
      chapterNum,
      userSeq,
      newUserOption
    );

    expect(status).to.equal(StatusCodes.CREATED);
  });

  it("한 챕터의 맞힌개수 조회", async () => {
    const { hitQuestionCount, questionCount } = await usecase.getHitCount(
      categorySeq,
      chapterNum,
      userSeq
    );

    expect(hitQuestionCount).to.be.above(0);
    expect(questionCount).to.be.above(0);
  });

  it("한 챕터의 선택기록 삭제", async () => {
    await usecase.deleteUserOption(categorySeq, chapterNum, userSeq);
  });

  it("카테고리별 평균 맞힌개수 챕터 전체조회", async () => {
    const selected = await usecase.getAvgHitCount();

    expect(selected).to.be.instanceOf(Array);
    expect(selected).to.have.length.above(0);
  });

  it("한 카테고리의 활성화된 챕터개수 조회", async () => {
    const { activeChapterCount, maxChapter } =
      await usecase.getActiveChapterCount(categorySeq, userSeq);

    expect(activeChapterCount).to.be.above(0);
    expect(maxChapter).to.be.above(0);
  });

  it("카테고리별 활성화된 챕터 전체조회", async () => {
    const selected = await usecase.getActiveChapter(categorySeq, userSeq);

    expect(selected).to.be.instanceOf(Array);
    expect(selected).to.have.length.above(0);
  });

  it("카테고리별 활성화된 챕터 부분조회", async () => {
    const totalCount = await usecase.getTotalCount(userSeq);
    const page = 1;
    const lastPage = Math.ceil(totalCount / limit);

    const selected = await usecase.getActiveChapterPage(
      limit,
      page,
      lastPage,
      userSeq
    );

    expect(selected).to.be.instanceOf(Array);
    expect(selected).to.have.length.above(0);
  });

  it("(관리자) 카테고리별 활성화된 챕터 부분조회 마지막 페이징값 조회", async () => {
    const totalCount = await usecase.getTotalCount(userSeq);
    const result = Math.ceil(totalCount / limit);

    expect(result).to.be.above(0);
  });
});
