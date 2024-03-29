const { StatusCodes } = require("http-status-codes");
const { EXIT_CODE } = require("../src/infrastructure-layer/constants");

function getRandomElement(arr) {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

module.exports = Object.freeze({
  setCookieValue: (req, res, context, events, next) => {
    const [cookie] = res.headers["set-cookie"];
    const cookieValue = cookie.split("=")[1];

    context.vars.cookieValue = cookieValue;
    return next();
  },

  setUserOption: (req, res, context, events, next) => {
    const { result } = JSON.parse(res.body);
    const userOption = {};

    result.forEach((each) => {
      const random = getRandomElement(each.optionArray);
      userOption[each.questionSeq] = random.questionOptionSeq;
    });

    context.vars.userOption = userOption;

    console.log(
      `${res.req.method} | ${res.req.path} | ${res.statusCode
      } | 질문일련번호-선택지일련번호: ${JSON.stringify(userOption)}`
    );
    return next();
  },

  setQuizQueryString: (req, res, context, events, next) => {
    const { result } = JSON.parse(res.body);
    const random = getRandomElement(result);

    const { categorySeq, chapterNumArray } = random;
    const chapterNum = getRandomElement(chapterNumArray);

    context.vars.categorySeq = categorySeq;
    context.vars.chapterNum = chapterNum;

    console.log(
      `${res.req.method} | ${res.req.path} | ${res.statusCode} | 카테고리일련번호: ${categorySeq} 챕터번호: ${chapterNum}`
    );
    return next();
  },

  setStatusCode: (req, res, context, events, next) => {
    context.vars.statusCode = res.statusCode;

    console.log(`${res.req.method} | ${res.req.path} | ${res.statusCode}`);
    return next();
  },

  isTooManyRequests: (req, res, context, events, next) => {
    if (res.statusCode === StatusCodes.TOO_MANY_REQUESTS) {
      const { message } = JSON.parse(res.body);
      console.error(`err: ${message} 종료합니다.`);
      process.exit(EXIT_CODE.APP_DEFINE_EXIT);
    }

    return next();
  },
});
