module.exports = ({
  RedisStore,
  makeSessionMiddleware,
  sessionStorage,
  statusCodes,
  errResponse,
}) => {
  const cookieOption = {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 15 * 60 * 1000, // +++ 15m
  };

  const sessionOption = {
    name: "loginData",
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new RedisStore({
      client: sessionStorage.get(),
      prefix: "session:",
    }),
    cookie: cookieOption,
  };

  return Object.freeze({
    session: makeSessionMiddleware(sessionOption),
    checkSessionCookie,
  });

  function checkSessionCookie(req, res, next) {
    if (!req.session || !req.session.user) {
      res.status(statusCodes.UNAUTHORIZED);
      return res.json(errResponse({ message: "권한이 없습니다." }));
    }

    return next();
  }
};
