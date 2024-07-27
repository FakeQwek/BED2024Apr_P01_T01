//Banned Users controller returns banned user json responses and logs internal server error if unsuccessful
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


//Takes name as parameter
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
        if (!unban) {
            return res.status(404).send("Banned user not found")
        }
        res.status(204).send("Success");
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