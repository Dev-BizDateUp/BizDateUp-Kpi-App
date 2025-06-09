const express = require('express');
const router = express.Router();
const { loginWithUsername, loginWithGoogle } = require('../controllers/loginController');

router.post('/login', loginWithUsername);
router.post('/g-login', loginWithGoogle);

module.exports = router;