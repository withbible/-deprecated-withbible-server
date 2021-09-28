const path = require('path');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { authenticate } = require("./middleware/authentication");
require(path.join(__dirname, "/public/database", "db.js"));

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(authenticate);

app.use('/quiz/v2', require('./routes/quiz_v2'))
app.use('/vote', require('./routes/vote'));
app.use('/user', require('./routes/user'));


app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
})
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('index', {
        'title': 'Not Found',
        'error': err.message
    });
})
app.listen(5000, function () {
    console.log('app listening on port 5000!');
});