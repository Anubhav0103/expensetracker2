const express = require('express');
const signupController = require('../controllers/signupController');

const router = express.Router();

// Make sure this route is correctly handling POST requests to "/signup"
router.post('/', signupController.handleSignup);

module.exports = router;
