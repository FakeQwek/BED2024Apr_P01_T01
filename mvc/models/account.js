const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class Account {
    constructor(accName, accEmail, isAdmin, isMuted, isBanned) {
        this.accName = accName;
        this.accEmail = accEmail;
        this.isAdmin = isAdmin;
        this.isMuted = isMuted;
        this.isBanned = isBanned;
    }

    static async getAllAccounts() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Account`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new Account(row.AccName, row.AccEmail, row.isAdmin, row.isMuted, row.isBanned));
    }

    static async getAccountByName(accName) {
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
                result.recordset[0].isBanned
            )
            : null;
    }
}

module.exports = Account;