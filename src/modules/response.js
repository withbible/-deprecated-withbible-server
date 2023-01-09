exports.response = function ({ message, meta = null, result = null }) {
  return {
    message,
    meta:
      (Array.isArray(result) && {
        ...meta,
        ...{
          count: result.length,
        },
      }) ||
      meta,
    result,
  };
};

exports.errResponse = function (message) {
  return {
    message,
  };
};
