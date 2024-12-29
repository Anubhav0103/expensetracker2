const db = require('../db/connection');

exports.handleSignup = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const insertUserQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(insertUserQuery, [name, email, password], (err) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            res.status(201).json({ message: 'Signup successful' });
        });
    });
};
