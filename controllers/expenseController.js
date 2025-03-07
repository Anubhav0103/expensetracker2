const db = require('../config/db');

// ✅ Fetch all expenses of the logged-in user
exports.getExpenses = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const [expenses] = await db.query(
            'SELECT id, amount, description, category FROM expenses WHERE user_id = ?',
            [userId]
        );

        res.status(200).json(expenses);
    } catch (error) {
        console.error("❌ Error fetching expenses:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Add a new expense
exports.addExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Insert the new expense
        await db.query(
            'INSERT INTO expenses (user_id, amount, description, category) VALUES (?, ?, ?, ?)',
            [userId, amount, description, category]
        );

        // Update total expense in `users` table
        await db.query(
            'UPDATE users SET total_expense = total_expense + ? WHERE id = ?',
            [amount, userId]
        );

        res.status(201).json({ message: "Expense added successfully" });
    } catch (error) {
        console.error("❌ Error adding expense:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Delete an expense
exports.deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Fetch the amount of the expense to be deleted
        const [[expense]] = await db.query(
            'SELECT amount FROM expenses WHERE id = ? AND user_id = ?',
            [expenseId, userId]
        );

        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        // Delete the expense
        await db.query('DELETE FROM expenses WHERE id = ? AND user_id = ?', [expenseId, userId]);

        // Update the total expense in `users` table
        await db.query(
            'UPDATE users SET total_expense = total_expense - ? WHERE id = ?',
            [expense.amount, userId]
        );

        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting expense:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Fetch leaderboard
exports.getLeaderboard = async (req, res) => {
    try {
        const [leaderboard] = await db.query(
            `SELECT name, total_expense 
             FROM users 
             ORDER BY total_expense DESC, id ASC`
        );

        res.status(200).json(leaderboard);
    } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};