const sql = require('mssql');
const dbConfig = require('../../dbConfig');

class User {
    constructor(user_id, username, passwordHash, role) {
        this.user_id = user_id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    static async createUser(newUser) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO Users (username, passwordHash, role) VALUES (@username, @passwordHash, @role)`;
        const request = connection.request();
        request.input('username', sql.VarChar, newUser.username);
        request.input('passwordHash', sql.VarChar, newUser.passwordHash);
        request.input('role', sql.VarChar, newUser.role);
        await request.query(sqlQuery);
        connection.close();
    }

    static async getUserByUsername(username) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Users WHERE username = @username`;
        const request = connection.request();
        request.input('username', sql.VarChar, username);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset[0];
    }
}

module.exports = User;
