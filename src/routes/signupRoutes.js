const express = require('express');
const signupController = require('../controller/signupController');

const router = express.Router();

router.post('/', signupController.handleSignup);

module.exports = router;
