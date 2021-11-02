const path = require('path');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { authenticate } = require("./middleware/authentication");
require("./utils/db");

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(
    morgan('dev'),
    express.json(),
    express.urlencoded({ extended: false }),
    cors(),
    authenticate
);
app.use('/quiz/v2', require('./routes/quiz_v2'))
app.use('/user', require('./routes/user'));


app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
})
app.use((err, req, res, next) => {
    req.session.id
    res.status(err.status || 500);
    res.render('index', {
        'title': 'Not Found',
        'error': err.message
    });
})
app.listen(5000, function () {
    console.log('app listening on port 5000!');
});