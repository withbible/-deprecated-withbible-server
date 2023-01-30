const docs = require("./docs");

module.exports = {
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

  USER_API_DOCS: Object.freeze([
    {
      rel: "POST",
      moreInfo: docs["POST.USER"],
    },
    {
      rel: "PATCH.LOGIN",
      moreInfo: docs["PATCH.LOGIN"],
    },
    {
      rel: "PATCH.LOGOUT",
      moreInfo: docs["PATCH.LOGOUT"],
    },
    {
      rel: "GET",
      moreInfo: docs["GET.LOGIN-CHECK"],
    },
  ]),

  QUIZ_API_DOCS: Object.freeze([
    {
      rel: "GET",
      moreInfo: docs["GET.QUIZ"],
    },
    {
      rel: "POST",
      moreInfo: docs["POST.QUIZ"],
    },
    {
      rel: "PUT",
      moreInfo: docs["PUT.QUIZ"],
    },
  ]),

  HISTORY_API_DOCS: Object.freeze([
    {
      rel: "GET",
      moreInfo: docs["GET.USER-OPTIONS"],
    },
    {
      rel: "POST",
      moreInfo: docs["POST.USER-OPTION"],
    },
    {
      rel: "PUT",
      moreInfo: docs["PUT.USER-OPTION"],
    },
  ]),
};
