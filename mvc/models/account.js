const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class Account {
    constructor(accId, accName, accEmail, isAdmin, isMuted, isBanned) {
        this.accId = accId;
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

        return result.recordset.map((row) => new Account(row.AccID, row.AccName, row.AccEmail, row.isAdmin, row.isMuted, row.isBanned));
    }

    static async getAccountById(accId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Account WHERE AccID = @accId`;

        const request = connection.request();
        request.input("accId", accId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new Account(
                result.recordset[0].AccID,
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