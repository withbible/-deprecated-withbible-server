const { Router } = require('express');
const router = Router();

const authenticate = require('../middleware/authentication');
const { authController, userController } = require('../controllers');

// +++ For Admin API
router.get('/', userController.getAllUser)


// +++ For EndUser API
router.post('/register', authController.register);

router.patch('/login', authController.login);

router.use(authenticate);

router.patch('/logout', authController.logout);

module.exports = router;
