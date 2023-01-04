exports.response = function (message, result) {
  return {
    isSuccess: true,
    message,
    result,
  };
};

exports.errResponse = function (message) {
  return {
    isSuccess: false,
    message,
  };
};
