const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const path = require("path");
const { logger } = require("../configs/logger");
const { response, errResponse } = require("../modules/response");
const service = require("./service");
const provider = require("./provider");

// CONSTANT
const dirName = path.basename(__dirname);

exports.getToken = async function (req, res) {
  const { userSeq } = req.session.user;

  try {
    const [token] = await provider.getToken(userSeq);

    res.json(
      response({
        message: "FCM 토큰 조회 완료",
        result: {
          userID: req.session.user.userID,
          token,
        },
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
      })
    );
  }
};

exports.postToken = async function (req, res) {
  const { token } = req.body;
  const { userSeq } = req.session.user;

  try {
    const result = await service.postToken(token, userSeq);

    res.status(StatusCodes.CREATED);
    res.json(
      response({
        message: "FCM 토큰 등록 완료",
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
      })
    );
  }
};

exports.putToken = async function (req, res) {
  const { token } = req.body;
  const { userSeq } = req.session.user;

  try {
    const result = await service.putToken(token, userSeq);

    res.status(StatusCodes.CREATED);
    res.json(
      response({
        message: "FCM 토큰 수정 완료",
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
      })
    );
  }
};
