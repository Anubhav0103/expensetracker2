const bcrypt = require("bcrypt");
const User = require("../models/User.js");

exports.signup = async (req, res) => {  // ✅ Function should be exported properly
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: "✅ User created successfully", userId: newUser.id });
    } catch (error) {
        res.status(500).json({ message: "⚠️ Server error", error });
    }
};

exports.login = async (req, res) => {  // ✅ Function should be exported properly
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "❌ Login failed: User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "❌ Login failed: Incorrect password" });

        res.status(200).json({ message: "✅ Login successful", userId: user.id });
    } catch (error) {
        res.status(500).json({ message: "⚠️ Server error", error });
    }
};
