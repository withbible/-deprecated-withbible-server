const { Router } = require('express');
const loginRouter = Router();
const fs = require('fs');
const js = require('fs').promises;


function authIsOwner(req, res) {
  if (req.session.if_logined) {
    return true;
  }
  else {
    return false;
  }

}

loginRouter.get('/login', (req, res) => {
  fs.readFile(__dirname + '/../public/html/login.html', 'utf8', (err, text) => {
    res.send(text);
  });
});

loginRouter.get('/membership', (req, res) => {
  fs.readFile(__dirname + '/../public/html/membership.html', 'utf8', (err, text) => {
    res.send(text);
  });
});

loginRouter.post("/login", (req, res) => {
  const id = req.body.id;
  const pw = req.body.pw;

  js.readFile(__dirname + "/../public/database/userdata.json")
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
          req.session.username = user.name[idx];//이름을 세션에 저장
          response.if_logined = req.session.if_logined;
          return res.json(response);//success라는 json을 프론트로 응답해줌
        }
      }
      response.success = false;
      response.msg = "로그인 실패";
      return res.json(response);
    })
    .catch((err) => { console.error(err) });//실패시 catch 실행
});

loginRouter.post('/membership', (req, res) => {
  const id = req.body.id;
  const pw = req.body.pw;
  const repw = req.body.repw;
  const name = req.body.name;
  const email = req.body.email;
  const age = req.body.age;

  js.readFile(__dirname + "/../public/database/userdata.json")
    .then(async function (data) {//성공했을때 then을 실행
      const user = await JSON.parse(data);
      console.log(user)
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

      const newdata = user;
      js.writeFile(__dirname + "/../public/database/userdata.json", JSON.stringify(newdata));
      response.success = true;
      return res.json(response);
    })
    .catch((err) => { console.error(err) });
});

module.exports = loginRouter;