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
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `INSERT INTO Users (username, passwordHash, role) VALUES (@new_username, @new_passwordHash, @new_role)`;

            const request = connection.request();
            request.input('new_username', sql.VarChar, newUser.username);
            request.input('new_passwordHash', sql.VarChar, newUser.passwordHash);
            request.input('new_role', sql.VarChar, newUser.role);

            const result = await request.query(sqlQuery);

            connection.close();
            return result.recordset[0]; // Assuming you want to return the created user object
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Error creating user');
        }
    }

    static async getUserByUsername(username) {
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `SELECT * FROM Users WHERE username = @username`;

            const request = connection.request();
            request.input('username', sql.VarChar, username);

            const result = await request.query(sqlQuery);
            connection.close();

            return result.recordset[0]; // Assuming you want to return the user object
        } catch (error) {
            console.error('Error fetching user by username:', error);
            throw new Error('Error fetching user by username');
        }
    }
}

module.exports = User;
