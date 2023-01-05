exports.response = function (message, result, meta = null) {
  return {
    message,
    meta,
    result,
  };
};

exports.errResponse = function (message) {
  return {
    message,
  };
};
