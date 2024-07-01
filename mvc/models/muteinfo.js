const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class MuteInfo {
    constructor(accName, muteDate, muteReason, mutedBy) {
        this.accName = accName;
        this.muteDate = muteDate;
        this.muteReason = muteReason;
        this.mutedBy = mutedBy;
    }

    static async getMuteInfoByAccount(accName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM MuteInfo WHERE AccName = @accName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map(row => new MuteInfo(row.AccName, row.muteDate, row.muteReason, row.mutedBy));
    }

    static async addMuteInfo(accName, muteDate, muteReason, mutedBy) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO MuteInfo (AccName, muteDate, muteReason, mutedBy) VALUES (@accName, @muteDate, @muteReason, @mutedBy)`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        request.input("muteDate", sql.VarChar, muteDate);
        request.input("muteReason", sql.VarChar, muteReason);
        request.input("mutedBy", sql.VarChar, mutedBy);
        await request.query(sqlQuery);
        connection.close();
    }

    static async removeMuteInfo(accName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM MuteInfo WHERE AccName = @accName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        await request.query(sqlQuery);
        connection.close();
    }
}

module.exports = MuteInfo;
