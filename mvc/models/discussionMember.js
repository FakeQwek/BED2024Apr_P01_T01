const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class DiscussionMember {
    constructor(dscMemID, accName, dscName) {
        this.dscMemID = dscMemID;
        this.accName = accName;
        this.dscName = dscName;
    }

    static async getAllDiscussionMembers() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM DiscussionMember`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new DiscussionMember(row.DscMemID, row.AccName, row.DscName));
    }

    static async getDiscussionMembersByDiscussion(dscName) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM DiscussionMember WHERE DscName = @dscName`;

        const request = connection.request();
        request.input("dscName", dscName);

        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new DiscussionMember(row.DscMemID, row.AccName, row.DscName));
    }

    static async createDiscussionMember(newDiscussionMemberData, dscName) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO DiscussionMember (DscMemID, AccName, DscName) SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE MAX(DscMemID) + 1 END, @accName, @dscName FROM DiscussionMember`;

        const request = connection.request();
        request.input("accName", newDiscussionMemberData.accName);
        request.input("dscName", dscName);

        const result = await request.query(sqlQuery);

        connection.close();
    }

    static async deleteDiscussionMember(accName, dscName) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM DiscussionMember WHERE AccName = @accName AND DscName = @dscName;`;

        const request = connection.request();
        request.input("accName", accName);
        request.input("dscName", dscName);

        const result = await request.query(sqlQuery);

        connection.close();

        return result;
    }
}

module.exports = DiscussionMember;