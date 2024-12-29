const db = require('../db/connection'); 

const handleLogin = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: 'Email and password are required.' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send({ message: 'Internal server error.' });
        }

        if (results.length === 0) {
            // User not found
            return res.status(404).send({ message: 'User not found.' });
        }

        const user = results[0];

        // Compare the provided password with the one stored in the database
        if (user.password !== password) {
            // Password mismatch
            return res.status(401).send({ message: 'User not authorized.' });
        }

        // Successful login
        res.status(200).send({ message: 'User login successful.' });
    });
};

module.exports = { handleLogin };
