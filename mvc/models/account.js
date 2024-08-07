const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class Account {
    constructor(accName, accEmail, isAdmin, isMuted, isBanned, password) {
        this.accName = accName;
        this.accEmail = accEmail;
        this.isAdmin = isAdmin;
        this.isMuted = isMuted;
        this.isBanned = isBanned;
        this.password = password;
    }

    static async getAllAccounts() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Account`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map((row) => new Account(
            row.AccName,
            row.AccEmail,
            row.isAdmin,
            row.isMuted,
            row.isBanned,
            row.Password
        ));
    }

    static async getAccountById(accName) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Account WHERE AccName = @accName`;

        const request = connection.request();
        request.input("accName", accName);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset[0]
            ? new Account(
                result.recordset[0].AccName,
                result.recordset[0].AccEmail,
                result.recordset[0].isAdmin,
                result.recordset[0].isMuted,
                result.recordset[0].isBanned,
                result.recordset[0].Password
            )
            : null;
    }

    static async getAccountByName(accName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Account WHERE AccName = @accName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset[0]
            ? new Account(
                result.recordset[0].AccName,
                result.recordset[0].AccEmail,
                result.recordset[0].isAdmin,
                result.recordset[0].isMuted,
                result.recordset[0].isBanned,
                result.recordset[0].Password
            )
            : null;
    }

    static async getAccountsIsBanned() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Account WHERE isBanned = 'True'`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map((row) => new Account(
            row.AccName,
            row.AccEmail,
            row.isAdmin,
            row.isMuted,
            row.isBanned,
            row.Password
        ));
    }

    static async banUser(accName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE Account SET isBanned = 'True' WHERE AccName = @accName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        await request.query(sqlQuery);
        connection.close();
    }

    static async unbanAccount(accName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE Account SET isBanned = 'False' WHERE AccName = @accName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        await request.query(sqlQuery);
        connection.close();
    }

    static async getAccountsIsMuted() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Account WHERE isMuted = 'True'`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map((row) => new Account(
            row.AccName,
            row.AccEmail,
            row.isAdmin,
            row.isMuted,
            row.isBanned,
            row.Password
        ));
    }

    static async muteUser(accName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE Account SET isMuted = 'True' WHERE AccName = @accName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        await request.query(sqlQuery);
        connection.close();
    }

    static async unmuteAccountByName(accName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE Account SET isMuted = 'False' WHERE AccName = @accName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        await request.query(sqlQuery);
        connection.close();
    }

    static async promoteUser(accName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE Account SET isAdmin = 'True' WHERE AccName = @accName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        await request.query(sqlQuery);
        connection.close();
    }

    static async demoteUser(accName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE Account SET isAdmin = 'False' WHERE AccName = @accName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        await request.query(sqlQuery);
        connection.close();
    }

    static async createAccount(account) {
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `
                INSERT INTO Account (AccName, AccEmail, Password, isAdmin, isMuted, isBanned) 
                VALUES (@accName, @accEmail, @password, @isAdmin, @isMuted, @isBanned)
            `;
            const request = connection.request();
            request.input("accName", sql.VarChar, account.accName);
            request.input("accEmail", sql.VarChar, account.accEmail);
            request.input("password", sql.VarChar, account.password);
            request.input("isAdmin", sql.VarChar, account.isAdmin);
            request.input("isMuted", sql.VarChar, account.isMuted);
            request.input("isBanned", sql.VarChar, account.isBanned);
            const result = await request.query(sqlQuery);
            connection.close();
            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.log('Error executing SQL query:', error);
            return false;
        }
    }
}

module.exports = Account;
