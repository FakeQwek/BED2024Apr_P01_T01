const User = require("../models/user");

const createUser = async (req, res) => {
    const newUser = req.body;
    try {
        const createduser = await User.createUser(newUser);
        res.status(201).json(createdUser);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating user");
    }
};

const getUserByUsername = async (req, res) => {
    const  user = req.body;
    try {
        const retreivedUser = await User.getUserByUsername(username);
        res.status(201).json(user);

    } catch(error) {
        console.log(error);
        res.status(500).send("Error getting user");
    }
    
}

