const express = require('express');
const router = express.Router();
const path = require('path');

const Vote = require('../models/Vote');

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1209405",
  key: "3d3b60f48ff35ad9680a",
  secret: "5824e223ddb2e7664ff9",
  cluster: "ap3",
  useTLS: true
});

const options = {
  headers: {
    'Content-Type': 'text/html'
  }
}

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html", "vote.html"), options);
})


router.get('/api', (_, res) => {
  Vote.find().then(votes =>
    res.json({ success: true, votes: votes })
  );
});

router.post('/api', (req, res) => {
  const newVote = {
    candidate: req.body.candidate,
    points: req.body.point
  }
  new Vote(newVote).save().then(vote => {
    pusher.trigger("candidate-poll", "candidate-vote", {
      points: parseInt(vote.points),
      candidate: vote.candidate,
    });
    return res.json({ success: true, message: 'Thank you for voting' });
  });
});

router.get('/admin', (_, res) => {
  res.sendFile(path.join(__dirname, "../public/html", "voteAdmin.html"), options);
});

router.post('/admin', (req, res) => {
  req.body.candidates.forEach(candidate => {
    new Vote({
      candidate: candidate,
      points: 0
    }).save()
  })
  return res.json({ success: true, message: 'Candidate Enrolled' });
})

module.exports = router;