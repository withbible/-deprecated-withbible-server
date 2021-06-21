var express = require('express');
const fs = require('fs');
const js = require('fs').promises;
const session = require("express-session");
const FileStore = require('session-file-store')(session);
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require('path');

require(path.join(__dirname, "/public/database", "db.js"));
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/quiz', require('./routes/quiz'))
app.use('/vote', require('./routes/vote'))
app.use(session({
    secret: 'secret',//세션의 비밀키 암호화 시켜줌
    resave: false,//세션을 항상 저장 할 것인지 :false
    saveUninitialized: true,//세션이 필요하기 전까진 구동x : true
    store: new FileStore()//파일 선언
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.get('/', (req, res) => {
    fs.readFile(__dirname + '/public/html/index.html', 'utf8', (err, text) => {
        res.send(text);
    });
})

app.get('/login', (req, res) => {
    fs.readFile(__dirname + '/public/html/login.html', 'utf8', (err, text) => {
        res.send(text);
    });
});

app.get('/membership', (req, res) => {
    fs.readFile(__dirname + '/public/html/membership.html', 'utf8', (err, text) => {
        res.send(text);
    });
});

//로그인 창에서 로그인 검사
app.post("/login", (req, res) => {
    fs.readFile(__dirname + '/login.html', 'utf8', (err, text) => {
        const id = req.body.id;
        const pw = req.body.pw;

        //js는 promise로 비동기적 작동을 한다. uerdata.json의 data를 parseing하는 부분은 기다려야함으로
        //await를 사용하여 부분을 기다려주도록 하였다.
        js.readFile(__dirname + "/public/database/userdata.json")
            .then(async function (data) {//성공했을때 then을 실행
                const user = await JSON.parse(data);
                const response = {};
                if (user.id.includes(id)) {//user객체에 id값이 있으면
                    const idx = user.id.indexOf(id);//user객체의 id인덱스값을 가져온다.idx로
                    if (user.pw[idx] === pw) {//user객체의 pw[idx]값이 pw와 값으면
                        response.success = true;
                        response.userId = user.id[idx];
                        req.session.successId = user.id[idx];//그 인덱스에 맞는 id값 세션에 저장!
                        req.session.if_logined = true;//로그인은 성공했어요
                        return res.json(response);//success라는 json을 프론트로 응답해줌
                    }
                }
                response.success = false;
                response.msg = "로그인 실패";
                return res.json(response);
            })
            .catch((err) => { console.error(err) });//실패시 catch 실행
    });
});

//화원값입 값을 모델에 저장해줌
app.post('/membership', (req, res) => {
    fs.readFile(__dirname + '/membership.html', 'utf8', (err, text) => {
        const id = req.body.id;
        const pw = req.body.pw;
        const repw = req.body.repw;
        const name = req.body.name;
        const email = req.body.email;
        const age = req.body.age;

        js.readFile(__dirname + "/public/database/userdata.json")
            .then(async function (data) {//성공했을때 then을 실행
                const user = await JSON.parse(data);

                const response = {};
                if (user.id.includes(id)) {//id 중복이 없으면
                    response.success = false;
                    response.msg = "중복 id";
                    return res.json(response);
                }

                user.id.push(id);
                user.pw.push(pw);
                user.repw.push(repw);
                user.name.push(name);
                user.email.push(email);
                user.age.push(age);
                user.score1.push('0');
                user.score2.push('0');
                user.score3.push('0');
                user.score4.push('0');
                user.score5.push('0');
                user.totalscore.push('0');

                const newdata = user;
                js.writeFile(__dirname + "/public/database/userdata.json", JSON.stringify(newdata));//문자형으로 바꿔서 저장해줌
                response.success = true;
                return res.json(response);//success라는 json을 프론트로 응답해줌
            })
            .catch((err) => { console.error(err) });//실패시 catch 실행

    });
});


app.listen(3000, function () {
    console.log('app listening on port 3000!');
});