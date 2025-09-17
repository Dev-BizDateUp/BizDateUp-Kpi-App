const express = require('express');
const router = express.Router();
const { loginWithUsername, loginWithGoogle,signUp } = require('../controllers/loginController');

router.post('/email', loginWithUsername);
router.post('/google', loginWithGoogle);
router.post('/signup', signUp);

module.exports = router;