const MutedUsers = require("../models/siteadmin-mutedUsers");

const getAllMutedUsers = async (req, res) => {
    try {
        const mutedusers = await MutedUsers.getAllMutedUsers();
        res.json(mutedusers);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving muted users");
    }
};

const getMutedUserByName = async (req,res) => {
    try {
        const mutedusers = await MutedUsers.getMutedUserByName();
        res.json(mutedusers);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving muted user by name");
    }
};

const unmuteUser = async (req, res) => {
    try {
        const unmute = await MutedUsers.unmuteUser();
        res.json(unmute);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error unmuting user");
    }
};

module.exports = {
    getAllMutedUsers,
    getMutedUserByName,
    unmuteUser

}