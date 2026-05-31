const express = require('express');
const controller = require('../controllers/authController');
const { requireFields } = require('../middleware/validate');

const router = express.Router();

router.post('/login', requireFields('email', 'password'), controller.login);
router.post('/verify-totp', requireFields('tempToken', 'token'), controller.verifyTotp);
router.post('/refresh-token', requireFields('refreshToken'), controller.refreshToken);
router.post('/logout', controller.logout);

module.exports = router;
