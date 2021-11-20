const authService = require("../service/auth");
const logger = require('../log');

const register = async (req, res) => {
  try {
    const { username, password, name } = req.body;
    const user = await authService.register(username, password, name);

    req.session.user = user;
    res.sendStatus(201);
  } catch (err) {
    res.status(401).json(err);
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await authService.login(username, password);

    req.session.user = user;
    logger.info(`${username} login!`)
    res.sendStatus(204);
  } catch (err) {
    logger.error(err);
    res.status(401).json(err);
  }
}

const logout = (req, res) => {
  try {
    delete req.session.user;
    res.sendStatus(204);
  } catch (err) {
    logger.error(err.message);
    res.status(401).json({ message: err.message });
  }
}

const keepLogin = (req, res) => {
  try {
    const { name, quizRecord } = req.session.user;
    res.json({
      message: 'keep logined',
      name,
      quizRecord
    });
  } catch (err) {
    logger.error(err);
    res.status(401).json({ message: err.message });
  }
}

module.exports = { register, login, logout, keepLogin }