// imports
const sql = require("mssql");
const dbConfig = require("../../dbConfig");

// discussion member class
class DiscussionMember {
    // discussion member constructor
    constructor(dscMemID, dscMemRole, isMuted, isBanned, accName, dscName) {
        this.dscMemID = dscMemID;
        this.dscMemRole = dscMemRole;
        this.isMuted = isMuted,
        this.isBanned = isBanned,
        this.accName = accName;
        this.dscName = dscName;
    }

    // get all discussion members
    static async getAllDiscussionMembers() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM DiscussionMember`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new DiscussionMember(row.DscMemID, row.DscMemRole, row.isMuted, row.isBanned, row.AccName, row.DscName));
    }

    // get discussion members that belong to discussion with discussion name
    static async getDiscussionMembersByDiscussion(dscName) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM DiscussionMember WHERE DscName = @dscName`;

        const request = connection.request();
        request.input("dscName", dscName);

        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new DiscussionMember(row.DscMemID, row.DscMemRole, row.isMuted, row.isBanned, row.AccName, row.DscName));
    }

    // get top 3 discussions that belong to user with account name
    static async getDiscussionMemberTop3Discussions(accName) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT TOP 3 * FROM DiscussionMember WHERE AccName = @accName`;

        const request = connection.request();
        request.input("accName", accName);

        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new DiscussionMember(row.DscMemID, row.DscMemRole, row.isMuted, row.isBanned, row.AccName, row.DscName));
    }

    // create discussion member
    static async createDiscussionMember(newDiscussionMemberData, dscName) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO DiscussionMember (DscMemID, DscMemRole, isMuted, isBanned, AccName, DscName) SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE MAX(DscMemID) + 1 END, @dscMemRole, 'False', 'False', @accName, @dscName FROM DiscussionMember`;

        const request = connection.request();
        request.input("dscMemRole", newDiscussionMemberData.dscMemRole);
        request.input("accName", newDiscussionMemberData.accName);
        request.input("dscName", dscName);

        const result = await request.query(sqlQuery);

        connection.close();
    }

    // delete discussion member
    static async deleteDiscussionMember(accName, dscName) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM DiscussionMember WHERE DscMemRole = 'Member' AND AccName = @accName AND DscName = @dscName;`;

        const request = connection.request();
        request.input("accName", accName);
        request.input("dscName", dscName);

        const result = await request.query(sqlQuery);

        connection.close();

        return result;
    }

    static async getAccountsIsBanned(dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM DiscussionMember WHERE isBanned = 'True' AND DscName = @dscName`;
        const request = connection.request();
        request.input("dscName", sql.VarChar, dscName);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map((row) => new DiscussionMember(
            row.DscMemID,
            row.DscMemRole,
            row.isMuted,
            row.isBanned,
            row.AccName,
            row.DscName
        ));
    }

    static async banUser(accName, dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE DiscussionMember SET isBanned = 'True' WHERE AccName = @accName AND DscName = @dscName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        request.input("dscName", sql.VarChar, dscName);
        await request.query(sqlQuery);
        connection.close();
    }

    static async unbanAccount(accName, dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE DiscussionMember SET isBanned = 'False' WHERE AccName = @accName AND DscName = @dscName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        request.input("dscName", sql.VarChar, dscName);
        await request.query(sqlQuery);
        connection.close();
    }

    static async getAccountsIsMuted(dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM DiscussionMember WHERE isMuted = 'True' AND DscName = @dscName`;
        const request = connection.request();
        request.input("dscName", sql.VarChar, dscName);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map((row) => new DiscussionMember(
            row.DscMemID,
            row.DscMemRole,
            row.isMuted,
            row.isBanned,
            row.AccName,
            row.DscName
        ));
    }

    static async muteUser(accName, dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE DiscussionMember SET isMuted = 'True' WHERE AccName = @accName AND DscName = @dscName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        request.input("dscName", sql.VarChar, dscName);
        await request.query(sqlQuery);
        connection.close();
    }

    static async unmuteAccount(accName, dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE DiscussionMember SET isMuted = 'False' WHERE AccName = @accName AND DscName = @dscName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        request.input("dscName", sql.VarChar, dscName);
        await request.query(sqlQuery);
        connection.close();
    }

    static async promoteUser(accName, dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE DiscussionMember SET DscMemRole = 'Admin' WHERE AccName = @accName AND DscName = @dscName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        request.input("dscName", sql.VarChar, dscName);
        await request.query(sqlQuery);
        connection.close();
    }

    static async demoteUser(accName, dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE DiscussionMember SET DscMemRole = 'Member' WHERE AccName = @accName AND DscName = @dscName`;
        const request = connection.request();
        request.input("accName", sql.VarChar, accName);
        request.input("dscName", sql.VarChar, dscName);
        await request.query(sqlQuery);
        connection.close();
    }
}

// export discussion member
module.exports = DiscussionMember;