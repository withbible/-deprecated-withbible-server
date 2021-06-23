const express = require('express');
const fs = require('fs');
const js = require('fs').promises;
const router = express.Router();
const path = require('path');
const data = require("../data.json");
const Quiz = require('../models/Quiz');


var options = {
  headers: {
    'Content-Type': 'text/html'
  }
}

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html", "quiz.html"));
  js.readFile(path.join(__dirname, "../public/database", "userdata.json"))
    .then(async function (data) {//성공했을때 then을 실행
      const user = await JSON.parse(data);
      console.log(req.session)
      const sessionid = req.session.successId;//session의 아이디 값 불러옴
      const idx = user.id.indexOf(sessionid);//session아이디값의 인덱스 번호

      const scorearray = [user.score1[idx], user.score2[idx], user.score3[idx], user.score4[idx], user.score5[idx]];
      for (var i = 0; i < scorearray.length; i++) {
        scorearray[i] = parseInt(scorearray[i]);//문자열을 숫자형으로 바꿔줌
      }
      const total = (acc, v) => acc + v;
      console.log("ID : ", sessionid);
      console.log("총점수 : ", scorearray.reduce(total));
      console.log("평균 : ", (scorearray.reduce(total)) / 5);

    })
    .catch((err) => { console.error(err) });//실패시 catch 실행
});

router.get('/api', (req, res) => {
  Quiz.find().then(quizs => {
    const result = quizs.filter(each => each.chapter == req.query.chapter);
    res.json({ success: true, quizs: result })
  }
  );
})

router.get('/api/q:quizId', (req, res) => {
  res.json(data);
})

router.get('/q:quizId', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html", `quiz${req.params.quizId}.html`), options);
});

router.post('/q:quizId', (req, res) => {
  const score = String(req.body.score);
  // send db
  new Quiz({
    chapter: req.params.quizId,
    scoreDetail: req.body.scoreDetail
  }).save()

  // handle static file
  fs.readFile(path.join(__dirname, "../public/html", `quiz${req.params.quizId}.html`), 'utf8', (err, text) => {
    js.readFile(path.join(__dirname, "../public/database", "userdata.json"))
      .then(async function (data) {
        const user = await JSON.parse(data);
        const response = {};
        const sessionid = req.session.successId;
        const idx = user.id.indexOf(sessionid);

        for (var each in user) {
          if (each.charAt(-1) == `${req.params.quizId}`) {
            each.splice(idx, 1, score)
          }
        }

        const newdata = user;
        response.success = true;

        js.writeFile(path.join(__dirname, "../public/database", "userdata.json"), JSON.stringify(newdata));
        return res.json(response);
      })
      .catch((err) => { console.error(err) });
  });
});

router.get('/totaldata', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html", "totaldata.html"), options);
});

module.exports = router;