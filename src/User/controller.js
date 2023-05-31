const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const path = require("path");
const logger = require("../configs/logger");
const { USER_API_DOCS } = require("../constants");
const docs = require("../constants/docs");
const { AUTO_LOGIN_AGE } = require("../middlewares/authenticator");
const { errResponse, response } = require("../utils/response");
const { filterReferenceOther } = require("../utils");
const service = require("./service");

// CONSTANT
const dirName = path.basename(__dirname);

// HELPER FUNCTION
function decodeAuthorization(authorization) {
  const encoded = authorization.split(" ")[1];
  const decoded = Buffer.from(encoded, "base64").toString();
  return decoded.split(":");
}

exports.postUser = async (req, res) => {
  const [userID, password] = decodeAuthorization(req.headers.authorization);
  const { userEmail, fcmToken } = req.body;

  try {
    const result = await service.postUser(
      userID,
      password,
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
        link: docs["POST.USER"],
      })
    );
  }
};

exports.login = async (req, res) => {
  const [userID, password] = decodeAuthorization(req.headers.authorization);
  const { isAutoLogin, fcmToken } = req.body;

  try {
    req.session.user = await service.login(userID, password, fcmToken);

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
        link: docs["PATCH.LOGIN"],
      })
    );
  }
};

exports.loginCheck = async (req, res) => {
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

exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.warn(`[${dirName}]_${err.message}`);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json(
        errResponse({
          message: err.message,
          link: docs["PATCH.LOGOUT"],
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
