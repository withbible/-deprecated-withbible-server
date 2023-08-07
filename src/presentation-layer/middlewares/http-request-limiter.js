module.exports = ({ makeRateLimitMiddleware, statusCodes, errResponse }) => {
  const option = {
    windowMs: 60 * 1000,
    max: process.env.MAX_REQUESTS,
    handler: (req, res) => {
      res.status(statusCodes.TOO_MANY_REQUESTS);
      res.json(
        errResponse({
          message: `1분에 ${process.env.MAX_REQUESTS}번만 요청 할 수 있습니다.`,
        })
      );
    },
  };

  return Object.freeze({
    rateLimit: makeRateLimitMiddleware(option),
  });
};
