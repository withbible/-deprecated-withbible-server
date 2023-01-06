exports.response = function (message, result) {
  return {
    message,
    meta: {
      ...(Array.isArray(result) && { count: result.length }),
    },
    result,
  };
};

exports.errResponse = function (message) {
  return {
    message,
  };
};
