const db = require('../db/connection');

// Fetch all expenses for the logged-in user
exports.getExpenses = (req, res) => {
  const userId = req.userId;
  const query = 'SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching expenses:', err);
      return res.status(500).send('Error fetching expenses');
    }
    res.status(200).json(results);
  });
};

// Add a new expense for the logged-in user
exports.addExpense = (req, res) => {
  const { amount, description, category } = req.body;
  const userId = req.userId;

  if (!userId || !amount || !description || !category) {
    return res.status(400).send('All fields are required');
  }

  const query = 'INSERT INTO expenses (user_id, amount, description, category) VALUES (?, ?, ?, ?)';
  db.query(query, [userId, amount, description, category], (err, result) => {
    if (err) {
      console.error('Error adding expense:', err);
      return res.status(500).send('Error adding expense');
    }
    res.status(201).send({ message: 'Expense added successfully', id: result.insertId });
  });
};

exports.deleteExpense = async (req, res) => {
  const expenseId = req.params.id;

  try {
      const result = await db.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2', [expenseId, req.userId]);
      if (result.rowCount > 0) {
          res.status(200).json({ message: 'Expense deleted successfully.' });
      } else {
          res.status(404).json({ message: 'Expense not found.' });
      }
  } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).json({ message: 'An error occurred while deleting the expense.' });
  }
};
