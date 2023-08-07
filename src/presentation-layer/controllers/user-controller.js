const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const path = require("path");
const logger = require("../../infrastructure-layer/configs/logger");
const docs = require("../../infrastructure-layer/constants/api-docs");
const { response, errResponse } = require("../../utils/response");
const { filterReferenceOther } = require("../../utils");

// CONSTANT
const fileName = path.basename(__filename, ".js");
const AUTO_LOGIN_AGE = 90 * 24 * 60 * 60 * 1000; // +++ 90d

// HELPER FUNCTION
function decodeAuthorization(authorization) {
  const encoded = authorization.split(" ")[1];
  const decoded = Buffer.from(encoded, "base64").toString();
  return decoded.split(":");
}

module.exports = (usecase) => {
  return Object.freeze({
    signup,
    login,
    loginCheck,
    logout,
  });

  async function signup(req, res) {
    const [userID, password] = decodeAuthorization(req.headers.authorization);
    const { userEmail } = req.body;

    try {
      const result = await usecase.post(userID, password, userEmail);

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
            links: filterReferenceOther(docs.USER_API_DOCS, req.method),
          },
          result: { userID: req.session.user.userID },
        })
      );
    } catch (err) {
      logger.warn(`[${fileName}]_${err.message}`);

      res.status(err.status);
      res.json(
        errResponse({
          message: err.message,
          link: docs["POST.USER"],
        })
      );
    }
  }

  async function login(req, res) {
    const [userID, password] = decodeAuthorization(req.headers.authorization);
    const { isAutoLogin } = req.body;

    try {
      req.session.user = await usecase.patch(userID, password);

      if (isAutoLogin) {
        req.session.cookie.maxAge = AUTO_LOGIN_AGE;
      }

      const message = `${userID} 로그인`;
      logger.info(message);

      res.json(
        response({
          message,
          meta: {
            links: filterReferenceOther(
              docs.USER_API_DOCS,
              `${req.method}.LOGIN`
            ),
          },
          result: { userID: req.session.user.userID },
        })
      );
    } catch (err) {
      logger.warn(`[${fileName}]_${err.message}`);

      res.status(err.status);
      res.json(
        errResponse({
          message: err.message,
          link: docs["PATCH.LOGIN"],
        })
      );
    }
  }

  async function loginCheck(req, res) {
    res.json(
      response({
        message: "세션이 유효합니다",
        meta: {
          links: filterReferenceOther(docs.USER_API_DOCS, req.method),
        },
        result: {
          userID: req.session.user.userID,
        },
      })
    );
  }

  async function logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        logger.warn(`[${fileName}]_${err.message}`);

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
              links: filterReferenceOther(
                docs.USER_API_DOCS,
                `${req.method}.LOGOUT`
              ),
            },
          })
        );
      }
    });
  }
};
