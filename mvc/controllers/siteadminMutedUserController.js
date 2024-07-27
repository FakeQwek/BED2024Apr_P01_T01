//Muted Users controller returns muted user json responses and logs internal server error if unsuccessful
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

//Takes name as parameter
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

//Takes accId as parameter
const unmuteUser = async (req, res) => {
    try {
        const accName = req.params.accName;
        const unmute = await MutedUsers.unmuteUser(accName);
        if (!unmute) {
            return res.status(404).send("Muted user not found")
        }
        res.status(204).send("Success");
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