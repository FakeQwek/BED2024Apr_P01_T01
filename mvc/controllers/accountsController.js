const Account = require("../models/account");

const getAllAccounts = async (req, res) =>  {
    try {
        const accounts = await Account.getAllAccounts();
        res.json(accounts);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving accounts");
    }
};

const getAccountByName = async (req, res) => {
    const accountName = parseInt(req.params.accName);
    try {
        const account = await Account.getAccountByName(accountName);
        if (!account) {
            return res.status(404).send("Account not found");
        }
        res.json(account);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving account");
    }
};

module.exports = {
    getAllAccounts,
    getAccountByName,
};