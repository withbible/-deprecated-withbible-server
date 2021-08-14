var express = require('express');
const session = require("express-session");
const FileStore = require('session-file-store')(session);
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');


require(path.join(__dirname, "/public/database", "db.js"));
var app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
    secret: 'secret',//세션의 비밀키 암호화 시켜줌
    resave: false,//세션을 항상 저장 할 것인지 :false
    saveUninitialized: false,//세션이 필요하기 전까진 구동x : true
    store: new FileStore(),//파일 선언
    httpOnly: false,
    cookie: {
        maxAge: 1000 * 60 * 60, //쿠키 유효시간 1시간!
    }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/quiz', require('./routes/quiz'));
app.use('/vote', require('./routes/vote'));
app.use('/users', require('./routes/user'));


app.get('/', (req, res) => {
    var if_logined = req.session.if_logined;
    res.render(__dirname + "/public/html/index.html", { if_logined: if_logined });
    // fs.readFile(__dirname + '/public/html/index.html', 'utf8', (err, text) => {
    //     var if_logined = req.session.if_logined;
    //     res.send(text);
    // });
})

app.listen(3000, function () {
    console.log('app listening on port 3000!');
});