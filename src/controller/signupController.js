exports.handleSignup = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    console.log('Received signup data:', req.body);
    res.status(200).json({ message: 'Signup successful', data: req.body });
};
