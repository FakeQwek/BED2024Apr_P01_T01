const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class BanInfo {
    constructor(accName, banDate, banReason, bannedBy) {
        this.accName = accName;
        this.banDate = banDate;
        this.banReason = banReason;
        this.bannedBy = bannedBy;
    }

    static async getBanInfoByAccount(accName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM BanInfo WHERE AccName = @accName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map(row => new BanInfo(row.AccName, row.banDate, row.banReason, row.bannedBy));
    }

    static async addBanInfo(accName, banDate, banReason, bannedBy) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO BanInfo (AccName, banDate, banReason, bannedBy) VALUES (@accName, @banDate, @banReason, @bannedBy)`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        request.input("banDate", sql.DateTime, banDate);
        request.input("banReason", sql.VarChar, banReason);
        request.input("bannedBy", sql.VarChar, bannedBy);
        await request.query(sqlQuery);
        connection.close();
    }

    static async removeBanInfo(accName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM BanInfo WHERE AccName = @accName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        await request.query(sqlQuery);
        connection.close();
    }
}

module.exports = BanInfo;
