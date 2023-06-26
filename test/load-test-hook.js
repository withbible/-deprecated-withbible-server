function getRandomElement(arr) {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

module.exports = Object.freeze({
  parseCookieValue: (req, res, context, events, next) => {
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

  getStatusCode: (req, res, context, events, next) => {
    context.vars.statusCode = res.statusCode;

    console.log(`${res.req.method} | ${res.req.path} | ${res.statusCode}`);
    return next();
  },
});
