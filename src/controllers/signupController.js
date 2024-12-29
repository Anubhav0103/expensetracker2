const db = require('../db/connection');

const bcrypt = require('bcrypt');

const handleSignup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send({ message: 'All fields are required.' });
    }

    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkQuery, [email], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send({ message: 'Internal server error.' });
        }

        if (results.length > 0) {
            return res.status(409).send({ message: 'User already exists.' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
            db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).send({ message: 'Error signing up user.' });
                }
                res.status(201).send({ message: 'User created successfully.' });
            });
        } catch (err) {
            console.error('Error hashing password:', err);
            res.status(500).send({ message: 'Error processing signup.' });
        }
    });
};

module.exports = { handleSignup };
