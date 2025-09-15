const express = require('express');
const router = express.Router();

const { login, forgotPassword } = require('../controllers/authController');

router.post('/login', login);
router.post('/forgotpassword', forgotPassword);

module.exports = router;