const sql = require("mssql");
const dbConfig = require("../../dbConfig");
const MuteInfo = require("../models/muteinfo.js");

const getMuteInfo = async (req, res) => {
    const accName = req.params.accName;
    try {
        const muteInfo = await MuteInfo.getMuteInfoByAccount(accName);
        if (muteInfo.length === 0) {
            return res.status(404).send("No mute information found for this user");
        }
        res.json(muteInfo);
    } catch (error) {
        console.error('Error retrieving mute information:', error);
        res.status(500).send("Error retrieving mute information");
    }
};

const addMuteInfo = async (req, res) => {
    const { accName, muteDate, muteReason, mutedBy } = req.body;
    try {
        await MuteInfo.addMuteInfo(accName, muteDate, muteReason, mutedBy);
        res.status(201).send("Mute information added successfully");
    } catch (error) {
        console.error('Error adding mute information:', error);
        res.status(500).send("Error adding mute information");
    }
};

const removeMuteInfo = async (req, res) => {
    const accName = req.params.accName;
    try {
        await MuteInfo.removeMuteInfo(accName);
        res.status(200).send(`User ${accName} has been unmuted.`);
    } catch (error) {
        console.error('Error removing mute information:', error);
        res.status(500).send("Error removing mute information");
    }
};


module.exports = {
    getMuteInfo,
    addMuteInfo,
    removeMuteInfo
};
