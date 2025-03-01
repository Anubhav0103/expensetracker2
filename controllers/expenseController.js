const pool = require('../config/db');

exports.addExpense = async (req, res) => {
    const { amount, description, category } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        await pool.query(
            "INSERT INTO expenses (user_id, amount, description, category) VALUES (?, ?, ?, ?)",
            [userId, amount, description, category]
        );

        return res.status(201).json({ message: "Expense added successfully" });

    } catch (error) {
        console.error("❌ Error adding expense:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getExpenses = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const [expenses] = await pool.query("SELECT * FROM expenses WHERE user_id = ?", [userId]);
        return res.status(200).json(expenses);

    } catch (error) {
        console.error("❌ Error fetching expenses:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
