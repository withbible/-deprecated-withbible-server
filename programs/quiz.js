const express = require('express');
const router = express.Router();
const path = require('path');
const data = require("./data.json")


router.get('/q:quizId', (req, res) => {
  var options = {
    headers: {
      'Content-Type': 'text/html'
    }
  }
  res.sendFile(path.join(__dirname, "./public/html", `quiz${req.params.quizId}.html`), options);
});

router.get('/api/q:quizId', (req, res) => {
  res.json(data);
})

module.exports = router;