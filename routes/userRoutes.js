const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");  // ✅ Import the controller

router.post("/signup", userController.signup);  // ✅ Make sure function names are correct
router.post("/login", userController.login);

module.exports = router;
