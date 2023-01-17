const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const path = require("path");
const { logger } = require("../configs/logger");
const { errResponse, response } = require("../modules/response");
const { filterReferenceOther } = require("../utils/util");
const service = require("./service");
const { USER_API_DOCS } = require("../constants/enum");
const DOCS = require("../constants/docs");

// CONSTANT
const dirName = path.basename(__dirname);
const AUTO_LOGIN_AGE = 90 * 24 * 60 * 60 * 1000;

// HELPER FUNCTION
function decodeAuthorization(authorization) {
  const encoded = authorization.split(" ")[1];
  const decoded = Buffer.from(encoded, "base64").toString();
  return decoded.split(":");
}

exports.postUser = async function (req, res) {
  const [userID, password] = decodeAuthorization(req.headers.authorization);
  const { userName, userEmail, fcmToken } = req.body;

  try {
    const result = await service.postUser(
      userID,
      password,
      userName,
      userEmail,
      fcmToken
    );

    req.session.user = {
      ...result,
      isLogined: true,
    };

    const message = `추가된 회원 : ${result.userID}`;
    logger.info(message);

    res.status(StatusCodes.CREATED);
    res.json(
      response({
        message,
        meta: {
          links: filterReferenceOther(USER_API_DOCS, req.method),
        },
        result: { userID: req.session.user.userID },
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: DOCS["POST.USER"],
      })
    );
  }
};

exports.login = async function (req, res) {
  const [userID, password] = decodeAuthorization(req.headers.authorization);
  const { isAutoLogin, fcmToken } = req.body;

  try {
    const result = await service.patchUser(userID, password, fcmToken);

    req.session.user = {
      ...result,
      isLogined: true,
    };

    if (isAutoLogin) {
      req.session.cookie.maxAge = AUTO_LOGIN_AGE;
    }

    const message = `${userID} 로그인`;
    logger.info(message);

    res.json(
      response({
        message,
        meta: {
          links: filterReferenceOther(USER_API_DOCS, `${req.method}.LOGIN`),
        },
        result: { userID: req.session.user.userID },
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: DOCS["PATCH.LOGIN"],
      })
    );
  }
};

exports.loginCheck = async function (req, res) {
  res.json(
    response({
      message: "세션이 유효합니다",
      meta: {
        links: filterReferenceOther(USER_API_DOCS, req.method),
      },
      result: {
        userID: req.session.user.userID,
      },
    })
  );
};

exports.logout = async function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      logger.warn(`[${dirName}]_${err.message}`);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json(
        errResponse({
          message: err.message,
          link: DOCS["PATCH.LOGOUT"],
        })
      );
    } else {
      const message = "로그아웃 되었습니다.";
      logger.info(message);

      res.clearCookie("loginData");
      res.json(
        response({
          message,
          meta: {
            links: filterReferenceOther(USER_API_DOCS, `${req.method}.LOGOUT`),
          },
        })
      );
    }
  });
};
