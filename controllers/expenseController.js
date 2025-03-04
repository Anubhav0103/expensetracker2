const db = require('../config/db');

exports.getLeaderboard = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT users.name, SUM(expenses.amount) AS total_expense
            FROM users
            JOIN expenses ON users.id = expenses.userId
            GROUP BY users.id
            ORDER BY total_expense DESC;
        `);
        res.json(results);
    } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

exports.addExpense = async (req, res) => {
    const { userId, amount, description, category } = req.body;
    try {
        await db.query("INSERT INTO expenses (userId, amount, description, category) VALUES (?, ?, ?, ?)", [userId, amount, description, category]);
        res.status(201).json({ message: "Expense added successfully" });
    } catch (error) {
        console.error("❌ Error adding expense:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const [results] = await db.query("SELECT amount, description, category FROM expenses");
        res.json(results);
    } catch (error) {
        console.error("❌ Error fetching expenses:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
