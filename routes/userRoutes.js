const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const pool = require('../config/db'); // ✅ Import the database connection pool

router.post("/signup", userController.signupUser);
router.post("/login", userController.loginUser);

// ✅ Add this route to get the user's session
router.get('/session', (req, res) => {
    if (req.session.userId) {
        res.json({ userId: req.session.userId });
    } else {
        res.status(401).json({ userId: null, message: "Not logged in" });
    }
});

router.get('/details', (req, res) => {
    // Assuming you have the user's ID in the session
    const userId = req.session.userId;

    if (!userId) {
        console.log("❌ No user ID found in session.");  // Added log
        return res.status(401).json({ message: "Unauthorized: No user ID found in session" });
    }

    // Fetch the user's details from the database
    pool.query('SELECT isPremium FROM users WHERE id = ?', [userId])
        .then(([rows]) => {
            if (rows.length === 0) {
                console.log(`❌ User with ID ${userId} not found in database.`);  // Added log
                return res.status(404).json({ message: "User not found" });
            }
            // Send the user's details (including isPremium) in the response
            console.log(`✅ User details fetched successfully for user ID ${userId}.`);  // Added log
            res.json(rows[0]); // { isPremium: 0 or 1 }
        })
        .catch(err => {
            console.error("❌ Error fetching user details:", err);  // Improved error log
            res.status(500).json({ message: "Failed to fetch user details", error: err.message }); // Include error message
        });
});

module.exports = router;