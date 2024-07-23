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

const getMutedUsersByName = async (req,res) => {
    try {
        const accName = req.params.name;
        const mutedusers = await MutedUsers.getMutedUsersByName(accName);
        res.json(mutedusers);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving muted users by name");
    }
};

const unmuteUser = async (req, res) => {
    try {
        const accId = req.params.accId;
        const unmute = await MutedUsers.unmuteUser(accId);
        res.json(unmute);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error unmuting user");
    }
};

module.exports = {
    getAllMutedUsers,
    getMutedUsersByName,
    unmuteUser

}