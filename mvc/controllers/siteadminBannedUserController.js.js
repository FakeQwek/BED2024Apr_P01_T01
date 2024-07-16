const BannedUsers = require("../models/siteadmin-bannedUsers");

const getAllBannedUsers = async (req, res) => {
    try {
        const bannedusers = await BannedUsers.getAllBannedUsers();
        res.json(bannedusers);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving banned users");
    }
};

const getBannedUsersByName = async (req,res) => {
    try {
        const accName = req.params.name;
        const bannedusers = await BannedUsers.getBannedUsersByName(accName);
        res.json(bannedusers);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving banned users by name");
    }
};

const unbanUser = async (req, res) => {
    try {
        const accId = req.params.accId;
        const unban = await BannedUsers.unbanUser(accId);
        res.json(unban);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error unbanning user");
    }
};

module.exports = {
    getAllBannedUsers,
    getBannedUsersByName,
    unbanUser

}