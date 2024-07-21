// imports
const sql =  require("mssql");
const dbConfig = require("../../dbConfig");
const { request } = require("express");

// invite class
class Invite {
    // invite constructor
    constructor(invId, accName, dscName) {
        this.invId = invId;
        this.accName = accName;
        this.dscName = dscName
    }

    // get all invites
    static async getAllInvites() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Invite`;

        const request = connection.request();
        const result = request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new Invite(row.InvID, row.AccName, row.DscName));
    }

    // get invites by discussion name
    static async getInvitesByDiscussion(dscName) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Invite WHERE DscName = @dscName`;

        const request = connection.request();
        request.input("dscName", dscName);
        const result = await request.query(sqlQuery);

        connection.close();
        
        return result.recordset.map((row) => new Invite(row.InvID, row.AccName, row.DscName));
    }

    // create invite
    static async createInvite(newInviteData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Invite (InvID, AccName, DscName) SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE MAX(InvID) + 1 END, @accName, @dscName FROM Invite`;

        const request = connection.request();
        request.input("accName", newInviteData.accName);
        request.input("dscName", newInviteData.dscName);

        const result = await request.query(sqlQuery);

        connection.close();
    }

    // delete invite
    static async deleteInvite(invId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM Invite WHERE InvID = @invId;`;

        const request = connection.request();
        request.input("invId", invId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result;
    }
}

// export invite
module.exports = Invite;