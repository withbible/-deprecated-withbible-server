require("dotenv").config();
const { expect } = require("chai");
const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const makeUserUsecase = require("./user-usecase");
const {
  leaderBoardRepository,
  userRepository,
} = require("../../data-access-layer/repositories");
const database = require("../../infrastructure-layer/external-services/database");

// CONSTANT
const userID = process.env.TEST_USER_ID;
const password = process.env.TEST_PASSWORD;
const userEmail = process.env.TEST_USER_EMAIL;

describe("사용자 관리 도메인", () => {
  let usecase;

  before(async () => {
    await database.init();

    usecase = makeUserUsecase(userRepository, leaderBoardRepository, database);
  });

  it("회원 가입", async () => {
    const userID = process.env.TEST_USER_ID_POST;
    const { userSeq } = await usecase.post(userID, password, userEmail);

    await Promise.all([
      userRepository.deleteUser(userSeq),
      leaderBoardRepository.deleteLeaderBoard(userSeq),
    ]);
  });

  it("회원 가입 (중복된 아이디)", async () => {
    try {
      await usecase.post(userID, password, userEmail);
    } catch (err) {
      expect(err.status).to.equal(StatusCodes.UNAUTHORIZED);
    }
  });

  it("로그인", async () => {
    const result = await usecase.patch(userID, password);

    expect(result.userID).equal(userID);
  });

  it("로그인 (유효하지 않은 아이디)", async () => {
    try {
      await usecase.patch("", password);
    } catch (err) {
      expect(err.status).to.equal(StatusCodes.UNAUTHORIZED);
    }
  });

  it("로그인 (유효하지 않은 비밀번호)", async () => {
    try {
      await usecase.patch(userID, "");
    } catch (err) {
      expect(err.status).to.equal(StatusCodes.UNAUTHORIZED);
    }
  });
});
