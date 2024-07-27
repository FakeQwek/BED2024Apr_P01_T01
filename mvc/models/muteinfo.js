const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class MuteInfo {
    constructor(accName, muteDate, muteReason, mutedBy, dscName) {
        this.accName = accName;
        this.muteDate = muteDate;
        this.muteReason = muteReason;
        this.mutedBy = mutedBy;
        this.dscName = dscName;
    }

    static async getMuteInfoByAccount(accName, dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM MuteInfo WHERE AccName = @accName AND dscName = @dscName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        request.input("dscName", sql.VarChar, dscName);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map(row => new MuteInfo(row.AccName, row.muteDate, row.muteReason, row.mutedBy, row.dscName));
    }

    static async addMuteInfo(accName, muteDate, muteReason, mutedBy, dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO MuteInfo (AccName, muteDate, muteReason, mutedBy, dscName) VALUES (@accName, @muteDate, @muteReason, @mutedBy, @dscName)`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        request.input("muteDate", sql.VarChar, muteDate);
        request.input("muteReason", sql.VarChar, muteReason);
        request.input("mutedBy", sql.VarChar, mutedBy);
        request.input("dscName", sql.VarChar, dscName);
        await request.query(sqlQuery);
        connection.close();
    }

    static async removeMuteInfo(accName, dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM MuteInfo WHERE AccName = @accName AND dscName = @dscName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        request.input("dscName", sql.VarChar, dscName);
        await request.query(sqlQuery);
        connection.close();
    }
}

module.exports = MuteInfo;
