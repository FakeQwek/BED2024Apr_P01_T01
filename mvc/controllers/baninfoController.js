const sql = require("mssql");
const dbConfig = require("../../dbConfig");
const BanInfo = require("../models/baninfo");

const getBanInfo = async (req, res) => {
    const accName = req.params.accName;
    const dscName = req.params.dscName;
    try {
        const banInfo = await BanInfo.getBanInfoByAccount(accName, dscName);
        if (banInfo.length === 0) {
            return res.status(404).send("No ban information found for this user");
        }
        res.json(banInfo);
    } catch (error) {
        console.error('Error retrieving ban information:', error);
        res.status(500).send("Error retrieving ban information");
    }
};

const addBanInfo = async (req, res) => {
    const { accName, banDate, banReason, bannedBy, dscName } = req.body;
    try {
        await BanInfo.addBanInfo(accName, banDate, banReason, bannedBy, dscName);
        res.status(201).send("Ban information added successfully");
    } catch (error) {
        console.error('Error adding ban information:', error);
        res.status(500).send("Error adding ban information");
    }
};

const removeBanInfo = async (req, res) => {
    const accName = req.params.accName;
    const dscName = req.params.dscName;
    try {
        await BanInfo.removeBanInfo(accName, dscName);
        res.status(200).send("Ban information removed successfully");
    } catch (error) {
        console.error('Error removing ban information:', error);
        res.status(500).send("Error removing ban information");
    }
};

module.exports = {
    getBanInfo,
    addBanInfo,
    removeBanInfo
};
