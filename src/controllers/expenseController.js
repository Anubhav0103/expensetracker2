const db = require('../db/connection'); 

// Fetch all expenses for the logged-in user
exports.getExpenses = (req, res) => {
    const userId = req.query.userId; // Sent from frontend
    if (!userId) {
        return res.status(400).send('User ID is required');
    }

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
    const { userId, amount, description, category } = req.body;
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

exports.deleteExpense = (req, res) => {
    const expenseId = req.params.id;
    const userId = req.user.id;

    const query = 'DELETE FROM expenses WHERE id = ? AND user_id = ?';
    db.query(query, [expenseId, userId], (err, result) => {
        if (err) {
            console.error('Error deleting expense:', err);
            return res.status(500).send('Error deleting expense');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Expense not found');
        }
        res.status(200).send({ message: 'Expense deleted successfully' });
    });
};
