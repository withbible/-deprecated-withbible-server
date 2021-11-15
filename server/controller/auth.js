const authService = require("../service/auth");

const register = async (req, res) => {
  try {
    const { username, password, name } = req.body;
    const user = await authService.register(username, password, name);

    req.session.user = user;
    res.sendStatus(204);
  } catch (err) {
    res.status(401).json(err);
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await authService.login(username, password);

    req.session.user = user;
    res.sendStatus(204);
  } catch (err) {
    res.status(401).json(err);
  }
}

const logout = (req, res) => {
  try {
    delete req.session.user;
    res.sendStatus(204);
  } catch (err) {
    res.status(401).json(err);
  }
}
module.exports = { register, login, logout }