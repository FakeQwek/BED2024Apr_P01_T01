const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class BanInfo {
    constructor(accName, banDate, banReason, bannedBy, dscName) {
        this.accName = accName;
        this.banDate = banDate;
        this.banReason = banReason;
        this.bannedBy = bannedBy;
        this.dscName = dscName;
    }

    static async getBanInfoByAccount(accName, dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM BanInfo WHERE AccName = @accName AND dscName = @dscName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        request.input("dscName", sql.VarChar, dscName);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map(row => new BanInfo(row.AccName, row.banDate, row.banReason, row.bannedBy, row.dscName));
    }

    static async addBanInfo(accName, banDate, banReason, bannedBy, dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO BanInfo (AccName, banDate, banReason, bannedBy, dscName) VALUES (@accName, @banDate, @banReason, @bannedBy, @dscName)`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        request.input("banDate", sql.DateTime, banDate);
        request.input("banReason", sql.VarChar, banReason);
        request.input("bannedBy", sql.VarChar, bannedBy);
        request.input("dscName", sql.VarChar, dscName);
        await request.query(sqlQuery);
        connection.close();
    }

    static async removeBanInfo(accName, dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM BanInfo WHERE AccName = @accName AND dscName = @dscName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        request.input("dscName", sql.VarChar, dscName);
        await request.query(sqlQuery);
        connection.close();
    }
}

module.exports = BanInfo;
