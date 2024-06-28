/*const Account = require("../models/account");

/*const getAllAccounts = async (req, res) =>  {
    try {
        const accounts = await Account.getAllAccounts();
        res.json(accounts);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving accounts");
    }
};

const getAccountById = async (req, res) => {
    const accountId = parseInt(req.params.accId);
    try {
        const account = await Account.getAccountById(accountId);
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
    getAccountById,
};*/

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


/*const Account = require("../models/account");

const createAccount = async (req, res) => {
    const { email, password } = req.body;
    const username = email.split('@')[0] || email; // Generate a username from the email
    const account = new Account(username, email, password, 'False', 'False', 'False');
    
    try {
        console.log('Attempting to create account:', account);
        const success = await Account.createAccount(account);
        if (success) {
            res.status(201).json({ success: true });
        } else {
            console.log('Account creation failed in the model.');
            res.status(500).json({ success: false });
        }
    } catch (error) {
        console.log('Error during account creation:', error);
        res.status(500).json({ success: false });
    }
};

const signUp = async (req, res) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const username = email.split("@")[0]; // Generate username from email
    const newAccount = new Account(username, email, password, "False", "False", "False");

    try {
        const accountCreated = await Account.createAccount(newAccount);
        if (accountCreated) {
            res.status(201).json({ success: true, message: "Account created successfully" });
        } else {
            res.status(500).json({ success: false, message: "Error creating account" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error creating account" });
    }
};

const testConnection = async (req, res) => {
    try {
        const connection = await sql.connect(dbConfig);
        console.log("Database connection established successfully");
        connection.close();
        res.status(200).json({ success: true, message: "Database connection established successfully" });
    } catch (error) {
        console.log("Database connection error:", error);
        res.status(500).json({ success: false, message: "Database connection error", error });
    }
};

const getAllAccounts = async (req, res) =>  {
    try {
        const accounts = await Account.getAllAccounts();
        res.json(accounts);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving accounts");
    }
};

const getAccountById = async (req, res) => {
    const accountId = parseInt(req.params.accId);
    try {
        const account = await Account.getAccountById(accountId);
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
    signUp,
    createAccount,
    testConnection,
    getAllAccounts,
    getAccountById,
};
*/

