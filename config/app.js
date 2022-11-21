const express = require('express');
const { StatusCodes } = require('http-status-codes');
const { errResponse } = require('../src/modules/response');
const { logger } = require('./logger');

module.exports = function () {
    const app = express();

    app.use(
        require('../src/middleware/morgan'),
        express.json(),
        express.urlencoded({ extended: false }),
        require('../src/middleware/cors'),
        require('../src/middleware/session'),
        express.static('public')
    );

    // TODO: 도메인을 추가할 경우 이곳에 Route를 추가하세요.
    require('../src/User/route')(app);
    require('../src/Quiz/route')(app);
    require('../src/History/route')(app);    

    app.use((req, res, next) => {
        const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
        next(err);
    });

    app.use((err, req, res, next) => {
        logger.error(err.message);
        res.status(StatusCodes.NOT_FOUND);
        res.json(errResponse(err.message));
    });

    return app;
};