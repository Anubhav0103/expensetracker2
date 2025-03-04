const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const db = require('../config/db'); // ✅ Fix: Ensure DB import

// ✅ Signup Route
router.post('/signup', userController.signupUser);

// ✅ Login Route
router.post('/login', userController.loginUser);

router.get("/session", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({ userId: req.session.userId });
});

router.get("/details", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const [user] = await db.query("SELECT isPremium FROM users WHERE id = ?", [req.session.userId]);
        if (!user.length) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.json({ isPremium: user[0].isPremium });
    } catch (error) {
        console.error("❌ Error fetching user details:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



module.exports = router;
