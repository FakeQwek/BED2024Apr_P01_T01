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

const sql = require("mssql");
const bcrypt = require("bcrypt");
const dbConfig = require("../../dbConfig");
const Account = require("../models/account");

const signup = async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
        return res.status(400).send('Both fields are required');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const pool = await sql.connect(dbConfig);

        const isEmail = usernameOrEmail.includes('@');
        const username = isEmail ? usernameOrEmail.split('@')[0] : usernameOrEmail;
        const email = isEmail ? usernameOrEmail : null;

        await pool.request()
            .input('AccName', sql.VarChar, username)
            .input('AccEmail', sql.VarChar, email)
            .input('Password', sql.VarChar, hashedPassword)
            .input('isAdmin', sql.VarChar, 'False')
            .input('isMuted', sql.VarChar, 'False')
            .input('isBanned', sql.VarChar, 'False')
            .query(`INSERT INTO Account (AccName, AccEmail, Password, isAdmin, isMuted, isBanned) 
                    VALUES (@AccName, @AccEmail, @Password, @isAdmin, @isMuted, @isBanned)`);

        res.status(201).send('User created successfully');
    } catch (err) {
        console.error('Database insertion error:', err.originalError ? err.originalError.message : err.message);
        res.status(500).send('Server error');
    }
};

const login = async (req, res) => {
    const { usernameOrEmail, password } = req.query;

    if (!usernameOrEmail || !password) {
        return res.status(400).send('Both fields are required');
    }

    try {
        const pool = await sql.connect(dbConfig);

        const isEmail = usernameOrEmail.includes('@');
        const username = isEmail ? null : usernameOrEmail;
        const email = isEmail ? usernameOrEmail : null;

        const result = await pool.request()
            .input('AccName', sql.VarChar, username)
            .input('AccEmail', sql.VarChar, email)
            .query(`SELECT * FROM Account WHERE (AccName = @AccName OR AccEmail = @AccEmail)`);

        if (result.recordset.length === 0) {
            return res.status(404).send('Your username/email did not sign up');
        }

        const user = result.recordset[0];
        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (passwordMatch) {
            const userData = {
                username: user.AccName,
                email: user.AccEmail
            };
            return res.status(200).json(userData);
        } else {
            return res.status(401).send('Login failed');
        }
    } catch (err) {
        console.error('Database error:', err.originalError ? err.originalError.message : err.message);
        res.status(500).send('Server error');
    }
};

const updateProfile = async (req, res) => {
    const { username, email, phoneNumber } = req.body;
    try {
        // Assuming you're using SQL and a pool from 'mssql' package
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('newUsername', sql.VarChar, username)
            .input('newEmail', sql.VarChar, email)
            .input('newPhoneNumber', sql.VarChar, phoneNumber || null) // Handling NULL if no phone number
            .query('UPDATE Account SET AccName = @newUsername, AccEmail = @newEmail, PhoneNumber = @newPhoneNumber WHERE AccEmail = @newEmail');

        if (result.rowsAffected[0] > 0) {
            res.json({ message: 'Profile updated successfully' });
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Failed to update profile');
    }
};




const deleteAccount = async (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).send('Username and Email are required');
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('AccName', sql.VarChar, username)
            .input('AccEmail', sql.VarChar, email)
            .query(`DELETE FROM Account WHERE AccName = @AccName AND AccEmail = @AccEmail`);

        if (result.rowsAffected[0] > 0) {
            res.status(200).send('Account deleted successfully');
        } else {
            res.status(404).send('Account not found');
        }
    } catch (err) {
        console.error('Database error:', err.originalError ? err.originalError.message : err.message);
        res.status(500).send('Server error');
    }
};


const getAllAccounts = async (req, res) => {
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

const getAccountByName = async (req, res) => {
    const accountName = req.params.accName;
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

const getAccountIsBanned = async (req, res) => {
    try {
        const bannedUsers = await Account.getAccountsIsBanned();
        if (bannedUsers.length === 0) {
            return res.status(404).send("No banned users found");
        }
        res.json(bannedUsers);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving banned users");
    }
};

const banUser = async (req, res) => {
    const accName = req.params.accName;
    const { banReason, bannedBy } = req.body;
    try {
        await Account.banUser(accName);
        res.status(200).send("User banned successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error banning user");
    }
};

const unbanAccount = async (req, res) => {
    const { accName } = req.params;

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('accName', sql.VarChar, accName)
            .query(`UPDATE Account SET isBanned = 'False' WHERE AccName = @accName`);

        res.status(200).send(`User ${accName} has been unbanned.`);
    } catch (error) {
        console.error('Error unbanning user:', error);
        res.status(500).send('Error unbanning user');
    }
};

const getAccountsIsMuted = async (req, res) => {
    try {
        const mutedAccounts = await Account.getAccountsIsMuted();
        if (mutedAccounts.length === 0) {
            return res.status(404).send("No muted users found");
        }
        res.json(mutedAccounts);
    } catch (error) {
        console.error('Error retrieving muted users:', error);
        res.status(500).send("Error retrieving muted users");
    }
};

const muteUser = async (req, res) => {
    const accName = req.params.accName;
    try {
        await Account.muteUser(accName);
        res.status(200).send("User muted successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error muting user");
    }
};

const unmuteUser = async (req, res) => {
    const accName = req.params.accName;
    try {
        await Account.unmuteAccountByName(accName);
        res.status(200).send(`User ${accName} has been unmuted.`);
    } catch (error) {
        console.error('Error unmuting user:', error);
        res.status(500).send("Error unmuting user");
    }
};

const promoteUser = async (req, res) => {
    const accName = req.params.accName;
    try {
        await Account.promoteUser(accName);
        res.status(200).send("User promoted successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error promoting user");
    }
};

const demoteUser = async (req, res) => {
    const accName = req.params.accName;
    try {
        await Account.demoteUser(accName);
        res.status(200).send("User demoted successfully");
    } catch (error) {
        console.error('Error demoting user:', error);
        res.status(500).send("Error demoting user");
    }
};

module.exports = { 
    updateProfile,
     deleteAccount,
    signup,
    login,
    getAllAccounts,
    getAccountById,
    getAccountByName,
    getAccountIsBanned,
    banUser,
    unbanAccount,
    getAccountsIsMuted,
    muteUser,
    unmuteUser,
    promoteUser,
    demoteUser,
    
    
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
