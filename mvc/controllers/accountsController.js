const sql = require("mssql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbConfig = require("../../dbConfig");
const Account = require("../models/account");

const JWT_SECRET = '3f3a94e1c0b5f11a8e0f2747d2a5e2f7a9a1c3b7d4d6e1e2f7b8c9d1a3e4f6a2'; // Replace with your own secret

const signup = async (req, res) => {
    const { usernameOrEmail, password} = req.body;

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
            .input('isSiteAdmin', sql.VarChar, isSiteAdmin)
            .query(`INSERT INTO Account (AccName, AccEmail, Password, isAdmin, isMuted, isBanned, isSiteAdmin) 
                    VALUES (@AccName, @AccEmail, @Password, @isAdmin, @isMuted, @isBanned)`);

        res.status(201).send('User created successfully');
    } catch (err) {
        console.error('Database insertion error:', err.originalError ? err.originalError.message : err.message);
        res.status(500).send('Server error');
    }
};

const login = async (req, res) => {
    const { usernameOrEmail, password } = req.body;

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
            return res.status(404).send('User not found');
        }

        const user = result.recordset[0];
        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (passwordMatch) {
            const token = jwt.sign({ username: user.AccName, email: user.AccEmail }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token, username: user.AccName, email: user.AccEmail });
        } else {
            return res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        console.error('Database error:', err.originalError ? err.originalError.message : err.message);
        res.status(500).send('Server error');
    }
};

const updateProfile = async (req, res) => {
    const { currentEmail, username, email, phoneNumber, emailNotification, gender } = req.body;

    console.log("Update Profile Request Received:", req.body);

    if (!currentEmail || !username || !email) {
        console.error("Missing required fields:", { currentEmail, username, email });
        return res.status(400).send('Current email, Username, and New email are required');
    }

    let transaction;

    try {
        const pool = await sql.connect(dbConfig);
        transaction = new sql.Transaction(pool);
        await transaction.begin();

        // Check if the new username already exists
        const checkUsernameRequest = new sql.Request(transaction);
        const checkUsernameQuery = `SELECT COUNT(*) as count FROM Account WHERE AccName = @newUsername`;
        const usernameCheckResult = await checkUsernameRequest
            .input('newUsername', sql.VarChar, username)
            .query(checkUsernameQuery);

        if (usernameCheckResult.recordset[0].count > 0) {
            console.error('The new username already exists.');
            await transaction.rollback();
            return res.status(400).send('The new username already exists.');
        }

        // Check if the foreign key constraint exists before disabling it
        const checkConstraintQuery = `SELECT 1 FROM sys.foreign_keys WHERE name = 'FK__Feedback__Userna__00AA174D'`;
        const constraintCheckResult = await new sql.Request(transaction).query(checkConstraintQuery);

        if (constraintCheckResult.recordset.length > 0) {
            // Temporarily remove foreign key constraint in Feedback table
            await new sql.Request(transaction).query(`ALTER TABLE Feedback NOCHECK CONSTRAINT FK__Feedback__Userna__00AA174D`);
        } else {
            console.warn("Foreign key constraint 'FK__Feedback__Userna__00AA174D' does not exist.");
        }

        // Update the feedback table first
        await new sql.Request(transaction)
            .input('newUsername', sql.VarChar, username)
            .input('currentEmail', sql.VarChar, currentEmail)
            .query(`UPDATE Feedback SET Username = @newUsername WHERE Username = (SELECT AccName FROM Account WHERE AccEmail = @currentEmail)`);

        // Update the account
        await new sql.Request(transaction)
            .input('newUsername', sql.VarChar, username)
            .input('newEmail', sql.VarChar, email)
            .input('newPhoneNumber', sql.VarChar, phoneNumber || null)
            .input('newEmailNotification', sql.VarChar, emailNotification || 'Not allowed')
            .input('newGender', sql.VarChar, gender || 'NIL')
            .input('currentEmail', sql.VarChar, currentEmail)
            .query(`UPDATE Account SET AccName = @newUsername, AccEmail = @newEmail, PhoneNumber = @newPhoneNumber, EmailNotification = @newEmailNotification, Gender = @newGender WHERE AccEmail = @currentEmail`);

        // Reinstate the foreign key constraint if it was previously disabled
        if (constraintCheckResult.recordset.length > 0) {
            await new sql.Request(transaction).query(`ALTER TABLE Feedback CHECK CONSTRAINT FK__Feedback__Userna__00AA174D`);
        }

        await transaction.commit();

        res.json({ message: 'Profile updated successfully' });

    } catch (err) {
        if (transaction) await transaction.rollback();
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
        res.status500.send("Error unmuting user");
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
    signup,
    login,
    updateProfile,
    deleteAccount,
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
