const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 

const JWT_SECRET = '123'; 

const createUser = async (req, res) => {
    const newUser = req.body;
    try {
        const existingUser = await User.getUserByUsername(newUser.username);
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        newUser.passwordHash = await bcrypt.hash(newUser.password, salt);

        const createdUser = await User.createUser(newUser);
        res.status(201).json(createdUser);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating user");
    }
};

const getUserByUsername = async (req, res) => {
    const { username } = req.params;
    try {
        const retrievedUser = await User.getUserByUsername(username);
        res.status(200).json(retrievedUser);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error getting user");
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await User.getUserByUsername(username);
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        
        const token = jwt.sign(
            { userId: user.user_id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );


        return res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createUser,
    getUserByUsername,
    login
};
