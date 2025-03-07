const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// ✅ Middleware to check session and ensure user is logged in
const authenticate = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
};

// ✅ Get all expenses of the logged-in user
router.get('/getAll', authenticate, expenseController.getExpenses);

// ✅ Add an expense
router.post('/add', authenticate, expenseController.addExpense);

// ✅ Fetch leaderboard (Premium users only)
router.get('/leaderboard', authenticate, expenseController.getLeaderboard);

// ✅ Delete an expense (NEWLY ADDED ROUTE)
router.delete('/delete/:id', authenticate, expenseController.deleteExpense);

module.exports = router;