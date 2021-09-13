const path = require('path');

const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const session = require("express-session");
const FileStore = require('session-file-store')(session);

require(path.join(__dirname, "/public/database", "db.js"));


const app = express();

// app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore(),
    httpOnly: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
    }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/quiz', require('./routes/quiz'));
app.use('/quiz/v2', require('./routes/quiz_v2'))
app.use('/vote', require('./routes/vote'));
app.use('/user', require('./routes/user'));


app.get('/', (req, res) => {
    var if_logined = req.session.if_logined;
    res.render(__dirname + "/public/html/index.html", { if_logined: if_logined });
    // fs.readFile(__dirname + '/public/html/index.html', 'utf8', (err, text) => {
    //     var if_logined = req.session.if_logined;
    //     res.send(text);
    // });
})

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