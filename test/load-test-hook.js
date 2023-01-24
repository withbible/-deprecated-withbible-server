function getRandomElement(arr) {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

module.exports = {
  parseCookieValue: (requestParams, response, context, event, next) => {
    const [cookie] = response.rawHeaders.filter((each) =>
      each.match(/(loginData)=(.*)$/)
    );

    /**
     * @description 2번째 인덱스를 추출한 이유
     * ["", cookieKey, cookieValue, ..., "" ]
     */
    const cookieValue = cookie.split(/(loginData)=(.*)$/)[2];
    context.vars.cookieValue = cookieValue;
    return next();
  },

  setUserOption: (requestParams, response, context, event, next) => {
    const { result } = JSON.parse(response.body);
    const userOption = {};

    result.forEach((each) => {
      const random = getRandomElement(each.optionArray);
      userOption[each.questionSeq] = random.questionOptionSeq;
    });

    context.vars.userOption = userOption;

    console.log(
      `${response.req.method} | ${response.req.path} | ${
        response.statusCode
      } | 챕터-선택지: ${JSON.stringify(userOption)}`
    );
    return next();
  },

  setQuizQueryString: (requestParams, response, context, event, next) => {
    const { result } = JSON.parse(response.body);
    const random = getRandomElement(result);

    const { categorySeq } = random;
    const chapterNum = getRandomElement(random.chapterNumArray);

    context.vars.categorySeq = categorySeq;
    context.vars.chapterNum = chapterNum;

    console.log(
      `${response.req.method} | ${response.req.path} | ${response.statusCode} | 카테고리일련번호: ${categorySeq} 챕터번호: ${chapterNum}`
    );
    return next();
  },

  getStatusCode: (requestParams, response, context, event, next) => {
    context.vars.statusCode = response.statusCode;

    console.log(
      `${response.req.method} | ${response.req.path} | ${response.statusCode}`
    );
    return next();
  },
};
