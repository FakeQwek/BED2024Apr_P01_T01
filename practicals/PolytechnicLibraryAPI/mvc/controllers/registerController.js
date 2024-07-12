const bcrypt = require("bcryptjs");
const User = require("../models/user");

const registerUser = async (req, res) => {
    const { username, password, role } = req.body;
  
    try {
        // Validate user data
        if (!username || !password || !role) {
            return res.status(400).json({ message: "Username, password, and role are required" });
        }

        const existingUser = await User.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user in database
        const newUser = { username, passwordHash: hashedPassword, role };
        await User.createUser(newUser);

        return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    registerUser
};
