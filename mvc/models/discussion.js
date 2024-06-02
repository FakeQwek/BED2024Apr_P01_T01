const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class Discussion {
    constructor(dscId, dscName, dscDesc, ownerId) {
        this.dscId = dscId;
        this.dscName = dscName;
        this.dscDesc = dscDesc;
        this.ownerId = ownerId;
    }

    static async getAllDiscussions() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Discussion`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new Discussion(row.DscID, row.DscName, row.DscDesc, row.OwnerID));
    }

    static async getDiscussionById(dscId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Discussion WHERE DscID = @dscId`;

        const request = connection.request();
        request.input("dscId", dscId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new Discussion(
                result.recordset[0].DscID,
                result.recordset[0].DscName,
                result.recordset[0].DscDesc,
                result.recordset[0].OwnerID
            )
            : null;
    }

    static async createDiscussion(newDiscussionData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Discussion (DscID, DscName, DscDesc, OwnerID) SELECT MAX(DscID) + 1, @dscName, @dscDesc, @ownerId FROM Discussion;`;

        const request = connection.request();
        request.input("dscName", newDiscussionData.dscName);
        request.input("dscDesc", newDiscussionData.dscDesc);
        request.input("ownerId", newDiscussionData.ownerId);

        const result = await request.query(sqlQuery);

        connection.close();
    }
}

module.exports = Discussion;