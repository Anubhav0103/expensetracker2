const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// ✅ Protect the routes (user must be logged in)
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
};

// ✅ Fix: Change `/getAll` to a GET request
router.get('/getAll', isAuthenticated, expenseController.getExpenses);
router.post('/add', isAuthenticated, expenseController.addExpense);

module.exports = router;
