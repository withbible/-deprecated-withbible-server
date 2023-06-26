module.exports = {
  response({ message, meta = null, result = null }) {
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
  },

  errResponse({ message, link, meta = null }) {
    return {
      message,
      meta,
      link,
    };
  },
};
