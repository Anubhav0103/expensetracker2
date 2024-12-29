const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authenticate = require('../middleware/authenticate'); 

router.get('/', authenticate, expenseController.getExpenses);

router.post('/', authenticate, expenseController.addExpense);

router.delete('/:id', authenticate, expenseController.deleteExpense);

module.exports = router;
