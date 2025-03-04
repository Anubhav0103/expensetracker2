const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.get('/leaderboard', expenseController.getLeaderboard);
router.post('/add', expenseController.addExpense);
router.get('/getAll', expenseController.getExpenses); // ✅ Fix: Fetch all expenses

module.exports = router;
