const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class User {
    constructor(user_id, username, passwordHash, role) {
        this.user_id = user_id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    static async createUser(newUser) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO Users (user_id, username, passwordHash, role) VALUES (@new_user_id, @new_username, @new_passwordHash, @new_role)`;

        const request = connection.request();
        request.input("new_user_id", newUser.new_user_id);
        request.input("new_username", newUser.new_username);
        request.input("new_passwordHash", newUser.new_passwordHash);
        request.input("role", newUser.new_role);

        const result = await request.query(sqlQuery);

        connection.close();
    }
}

module.exports = User;
