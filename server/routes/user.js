const { Router } = require('express');
const router = Router();

const authenticate = require('../middleware/authentication');
const authController = require('../controller/auth');

router.post('/register', authController.register);

router.patch('/login', authController.login);

router.use(authenticate);

router.patch('/logout', authController.logout);

module.exports = router;
