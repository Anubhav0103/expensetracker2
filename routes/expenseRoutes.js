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

router.post('/add', isAuthenticated, expenseController.addExpense);
router.get('/getAll', isAuthenticated, expenseController.getExpenses);

module.exports = router;
