module.exports = {
  parseCookieValue: (requestParams, response, context, event, next) => {
    const [cookie] = response.rawHeaders.filter((each) =>
      each.match(/(loginData)=(.*)$/)
    );

    const cookieValue = cookie.split(/(loginData)=(.*)$/)[2];
    context.vars.cookieValue = cookieValue;
    return next();
  },
};
