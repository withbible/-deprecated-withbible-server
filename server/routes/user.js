const util = require('util');
const { Router } = require('express');
const userRouter = Router();
const { hash, compare } = require("bcryptjs");

const User = require("../models/User");
const { SUBJECT_CODE } = require("../utils/quiz");
const DefaultDict = require('../utils/collection');

userRouter.post("/register", async (req, res) => {
  const { username, password, name } = req.body;
  try {
    if (password.length < 6)
      throw new Error("비밀번호를 최소 6자 이상으로 해주세요.");
    if (username.length < 3)
      throw new Error("username은 3자 이상으로 해주세요.");

    const hashedPassword = await hash(password, 10);
    const user = await new User({
      name,
      username,
      hashedPassword,
      sessions: [{ createdAt: new Date() }],
      quizRecord: {}
    }).save();
    const session = user.sessions[0];
    res.json({
      message: "user registered",
      userId: user.id,
      sessionId: session._id,
      name: user.name,
      quizRecord: user.quizRecord
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
userRouter.patch('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user)
      throw new Error("가입되지 않은 아이디입니다.");
    const isValid = await compare(req.body.password, user.hashedPassword);
    if (!isValid)
      throw new Error("입력하신 정보가 올바르지 않습니다.");

    user.sessions.push({ createdAt: new Date() });
    const session = user.sessions[user.sessions.length - 1];
    await user.save();
    res.json({
      message: "user validated",
      userId: user.id,
      sessionId: session._id,
      name: user.name,
      quizRecord: user.quizRecord
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
userRouter.patch("/logout", async (req, res) => {
  try {
    if (!req.user)
      throw new Error("invalid sessionid");

    await User.updateOne(
      { _id: req.user.id },
      { $pull: { sessions: { _id: req.headers.sessionid } } }
    );
    res.json({ message: "user is logged out." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
userRouter.get("/me", (req, res) => {
  const { id, name, quizRecord } = req.user;
  try {
    if (!req.user)
      throw new Error("권한이 없습니다.");

    res.json({
      message: "success",
      userId: id,
      sessionId: req.headers.sessionid,
      name,
      quizRecord
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
userRouter.patch("/record/:chapterid", async (req, res) => {
  try {
    if (!req.user)
      throw new Error("권한이 없습니다.");
    const { chapterid } = req.params;
    await User.updateOne(
      { _id: req.user.id },
      {
        "$set": {
          [`quizRecord.${chapterid}`]: req.body.sheet[chapterid]
        }
      },
    );
    res.json({ message: `${chapterid} is updated` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
userRouter.get("/myscore", async (req, res) => {
  try {
    if (!req.user)
      throw new Error("권한이 없습니다.");
    const { name, quizRecord } = req.user;
    const result = new DefaultDict(_ => []);
    for (const [chapterId, chapterRecord] of Object.entries(quizRecord)) {
      const subjectTitle = SUBJECT_CODE[chapterId.match(/^.[^_]/)];
      result[subjectTitle].push({
        "chapterId": parseInt(chapterId.match(/[1-9][0-9]*/)),
        "detail": {
          "score": chapterRecord.filter(each => each === true).length + "/" + chapterRecord.length,
          "state": chapterRecord.some(each => each === null) ? "proceed" : "end"
        }
      })
      result[subjectTitle].sort((a, b) =>
        (a.chapterId > b.chapterId) ? 1
          : (b.chapterId > a.chapterId) ? -1
            : 0);
    }

    res.json({ data: result, name });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
})

module.exports = userRouter;