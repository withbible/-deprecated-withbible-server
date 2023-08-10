const link = {
  "POST.USER":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#ab2dfa38-50f7-444c-911d-19275bac968d",
  "PATCH.LOGIN":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#7ac3f6f1-2de5-4d2d-9555-bf1629613ea7",
  "GET.LOGIN-CHECK":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#56356070-2e82-446f-af20-558800030eeb",
  "PATCH.LOGOUT":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#ce78c407-8a82-450c-aaef-43ce3e20fcb1",
  "GET.CHAPTER":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#8e8515a0-c9f8-49c4-b629-42e623bdf151",
  "GET.QUIZ":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#c78aa942-ff08-4b2d-aa8b-86c8b9f73f2b",
  "POST.QUIZ":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#551c845e-c9f1-48f7-b0a3-1462da5c06b9",
  "PUT.QUIZ":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#750ba64a-bdae-406c-8d0a-c2416cd69b65",
  "GET.CREATED-COUNT":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#85553210-7171-4c15-b37e-fdeb7f21d68f",
  "GET.HIT-COUNT":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#415a33d7-012e-45a7-bbcf-a669e90e2336",
  "GET.AVG-HIT-COUNT":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#141b7de1-62ea-4730-ac36-8223af4f87e7",
  "GET.USER-OPTION":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#cdac7f5e-3d2f-4054-89f4-6993f0b1fc47",
  "POST.USER-OPTION":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#9ccf3ae7-46ed-4424-bedd-506ef083795e",
  "PUT.USER-OPTION":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#4073cc67-8a41-4b4e-9314-4cd65aa8d0d5",
  "DELETE.USER-OPTION":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#6db8505d-f3ba-4d13-ab1e-26cb2c102322",
  "GET.ACTIVE-CHAPTER-COUNT":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#a61d2c21-ee0a-46c7-9fa2-513a1621c9c7",
  "GET.ACTIVE-CHAPTER":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#1e62e850-3ea9-424c-ac4f-38c3081a2197",
  "GET.ACTIVE-CHAPTER-PAGE":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#a9087555-cd29-4ad5-bdd2-b92051af353a",
  "GET.LEADER-BOARD":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#29f7b890-3ef6-4428-befb-a165524a00ce",
  "GET.LEADER-BOARD-PAGE":
    "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#6e92a59d-1ada-4b77-8625-6efd421d32b8",
};

module.exports = {
  USER_API_DOCS: Object.freeze([
    {
      rel: "POST",
      moreInfo: link["POST.USER"],
    },
    {
      rel: "PATCH.LOGIN",
      moreInfo: link["PATCH.LOGIN"],
    },
    {
      rel: "PATCH.LOGOUT",
      moreInfo: link["PATCH.LOGOUT"],
    },
    {
      rel: "GET",
      moreInfo: link["GET.LOGIN-CHECK"],
    },
  ]),

  QUIZ_API_DOCS: Object.freeze([
    {
      rel: "GET",
      moreInfo: link["GET.QUIZ"],
    },
    {
      rel: "POST",
      moreInfo: link["POST.QUIZ"],
    },
    {
      rel: "PUT",
      moreInfo: link["PUT.QUIZ"],
    },
  ]),

  HISTORY_API_DOCS: Object.freeze([
    {
      rel: "GET",
      moreInfo: link["GET.USER-OPTION"],
    },
    {
      rel: "POST",
      moreInfo: link["POST.USER-OPTION"],
    },
    {
      rel: "PUT",
      moreInfo: link["PUT.USER-OPTION"],
    },
    {
      rel: "DELETE",
      moreInfo: link["DELETE.USER-OPTION"],
    },
  ]),
};
