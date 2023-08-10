module.exports = {
  MAX_RETRY_ATTEMPTS: 5,

  CATEGORY: Object.freeze({
    1: "모세오경",
    2: "역사서",
    3: "시가서",
    4: "예언서",
    5: "복음서",
    6: "바울서신",
    7: "공동서신",
    8: "요한계시록",
  }),

  EXIT_CODE: Object.freeze({
    APP_DEFINE_EXIT: 1,
    CMD_ARG_EXIT: 2,
  }),
};
