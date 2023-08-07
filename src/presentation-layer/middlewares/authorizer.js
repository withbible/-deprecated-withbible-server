module.exports = (makeCorsMiddleware) => {
  const option = {
    origin: [process.env.LOCAL_GUEST, process.env.CLOUD_GUEST],
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  };

  return Object.freeze({
    cors: makeCorsMiddleware(option),
  });
};
