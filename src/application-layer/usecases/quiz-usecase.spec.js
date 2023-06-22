require("dotenv").config();
const { expect } = require("chai");
const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const makeQuizUsecase = require("./quiz-usecase");
const { quizRepository } = require("../../data-access-layer/repositories");
const database = require("../../infrastructure-layer/external-services/database");

describe("퀴즈 도메인", () => {
  let usecase;

  before(async () => {
    await database.init();

    usecase = makeQuizUsecase(quizRepository, database);
  });

  it("카테고리별 챕터수 전체조회", async () => {
    const result = await usecase.getChapter();

    expect(result).to.be.instanceOf(Array);
    expect(result).to.have.length.above(0);

    const chapter = result.at(-1);
    expect(chapter.chapterNumArray).to.be.instanceOf(Array);
  });

  it("카테고리별 챕터수 조회 (검색어 포함)", async () => {
    const keyword = "모세";
    const result = await usecase.getChapter(keyword);

    expect(result).to.be.instanceOf(Array);
    expect(result).to.have.length.above(0);

    const chapter = result.at(-1);
    expect(chapter.chapterNumArray).to.be.instanceOf(Array);
  });

  it("카테고리별 챕터수 조회 (유효하지 않은 검색어 포함)", async () => {
    const keyword = "졸업";

    try {
      await usecase.getChapter(keyword);
    } catch (err) {
      expect(err.status).to.equal(StatusCodes.BAD_REQUEST);
    }
  });

  it("한 챕터의 질문-선택지 전체조회", async () => {
    const categorySeq = 1;
    const chapterNum = 3;
    const result = await usecase.getQuiz(categorySeq, chapterNum);

    expect(result).to.be.instanceOf(Array);
    expect(result).to.have.length.above(0);

    const quiz = result.at(-1);
    expect(quiz.optionArray).to.be.instanceOf(Array);
  });

  it("한 챕터의 질문-선택지 전체조회 (유효하지 않은 인자값)", async () => {
    const categorySeq = 9;
    const chapterNum = 9;

    try {
      await usecase.getQuiz(categorySeq, chapterNum);
    } catch (err) {
      expect(err.status).to.equal(StatusCodes.NOT_FOUND);
    }
  });

  it("(관리자) 질문-선택지-정답여부 생성", async () => {
    const categorySeq = 5;
    const question = "테스트 질문";
    const questionSub = "테스트 보조질문";
    const optionArray = [
      {
        questionOptionSeq: 9996,
        questionOption: "옵션A",
        answerYN: 1,
      },
      {
        questionOptionSeq: 9997,
        questionOption: "옵션B",
        answerYN: 0,
      },
      {
        questionOptionSeq: 9998,
        questionOption: "옵션C",
        answerYN: 0,
      },
      {
        questionOptionSeq: 9999,
        questionOption: "옵션D",
        answerYN: 0,
      },
    ];

    const { questionSeq, questionCount } = await usecase.postQuiz(
      categorySeq,
      question,
      questionSub,
      optionArray
    );

    expect(questionCount).to.equal(1);

    await Promise.all([
      quizRepository.deleteQuestion(questionSeq),
      quizRepository.deleteOptionArray(questionSeq),
    ]);
  });

  it("(관리자) 질문-선택지-정답여부 생성 (중복된 데이터)", async () => {
    const question =
      "우리아의 아내 밧세바를 범하고 우리아를 죽인 다윗을 책망한 선지자는 누구인가?";

    try {
      await usecase.postQuiz(undefined, question);
    } catch (err) {
      expect(err.status).to.equal(StatusCodes.METHOD_NOT_ALLOWED);
    }
  });

  it("(관리자) 질문-선택지-정답여부 수정", async () => {
    const questionSeq = 26;
    const question =
      "우리아의 아내 밧세바를 범하고 우리아를 죽인 다윗을 책망한 선지자는 누구인가?";
    const questionSub = null;
    const optionArray = [
      {
        questionOptionSeq: 106,
        questionOption: "나단",
        answerYN: 1,
      },
      {
        questionOptionSeq: 107,
        questionOption: "엘리야",
        answerYN: 0,
      },
      {
        questionOptionSeq: 108,
        questionOption: "엘리사",
        answerYN: 0,
      },
      {
        questionOptionSeq: 109,
        questionOption: "말라기",
        answerYN: 0,
      },
    ];

    const { categorySeq, chapterNum } = await usecase.putQuiz(
      questionSeq,
      question,
      questionSub,
      optionArray
    );

    expect(categorySeq).to.equal(2);
    expect(chapterNum).to.equal(3);
  });
});
