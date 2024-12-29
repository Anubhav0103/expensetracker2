const db = require('../db/connection'); 

const bcrypt = require('bcrypt');

const handleLogin = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: 'Email and password are required.' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send({ message: 'Internal server error.' });
        }

        if (results.length === 0) {
            return res.status(404).send({ message: 'User not found.' });
        }

        const user = results[0];

        try {
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).send({ message: 'User not authorized.' });
            }

            res.status(200).send({ message: 'User login successful.' });
        } catch (err) {
            console.error('Error comparing passwords:', err);
            res.status(500).send({ message: 'Error processing login.' });
        }
    });
};

module.exports = { handleLogin };
