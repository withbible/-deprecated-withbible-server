const DOCS = require("./docs");

module.exports = {
  CATEGORY: Object.freeze({
    1: "모세오경",
    2: "역사서",
    3: "선지서",
    4: "사복음서",
    5: "사도행전",
    6: "요한계시록",
  }),

  USER_API_DOCS: Object.freeze([
    {
      rel: "POST",
      moreInfo: DOCS["POST.USER"],
    },
    {
      rel: "PATCH.LOGIN",
      moreInfo: DOCS["PATCH.LOGIN"],
    },
    {
      rel: "PATCH.LOGOUT",
      moreInfo: DOCS["PATCH.LOGOUT"],
    },
    {
      rel: "GET",
      moreInfo: DOCS["GET.LOGIN-CHECK"],
    },
  ]),

  QUIZ_API_DOCS: Object.freeze([
    {
      rel: "GET",
      moreInfo: DOCS["GET.QUIZ"],
    },
    {
      rel: "POST",
      moreInfo: DOCS["POST.QUIZ"],
    },
    {
      rel: "PUT",
      moreInfo: DOCS["PUT.QUIZ"],
    },
  ]),

  HISTORY_API_DOCS: Object.freeze([
    {
      rel: "GET",
      moreInfo: DOCS["GET.USER-OPTIONS"],
    },
    {
      rel: "POST",
      moreInfo: DOCS["POST.USER-OPTION"],
    },
    {
      rel: "PUT",
      moreInfo: DOCS["PUT.USER-OPTION"],
    },
  ]),
};
