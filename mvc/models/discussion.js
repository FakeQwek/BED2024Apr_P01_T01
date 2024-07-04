const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class Discussion {
    constructor(dscName, dscDesc, dscType, accName) {
        this.dscName = dscName;
        this.dscDesc = dscDesc;
        this.dscType = dscType;
        this.accName = accName;
    }

    static async getAllDiscussions() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Discussion`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new Discussion(row.DscName, row.DscDesc, row.DscType, row.OwnerID));
    }

    static async getDiscussionByName(dscName) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Discussion WHERE DscName = @dscName`;

        const request = connection.request();
        request.input("dscName", dscName);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new Discussion(
                result.recordset[0].DscName,
                result.recordset[0].DscDesc,
                result.recordset[0].DscType,
                result.recordset[0].OwnerID
            )
            : null;
    }

    static async createDiscussion(newDiscussionData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Discussion (DscName, DscDesc, DscType, OwnerID) VALUES(@dscName, @dscDesc, @dscType, @accName);`;

        const request = connection.request();
        request.input("dscName", newDiscussionData.dscName);
        request.input("dscDesc", newDiscussionData.dscDesc);
        request.input("dscType", newDiscussionData.dscType);
        request.input("accName", newDiscussionData.accName);

        const result = await request.query(sqlQuery);

        connection.close();
    }

    static async updateDiscussionDescription(dscName, newDiscussionData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Discussion SET DscDesc = @dscDesc WHERE DscName = @dscName`;

        const request = connection.request();
        request.input("dscDesc", newDiscussionData.dscDesc);
        request.input("dscName", dscName);

        await request.query(sqlQuery);

        connection.close();
    }

    static async searchDiscussions(searchTerm) {
        const connection = await sql.connect(dbConfig);

        try {
            const sqlQuery = `SELECT * FROM Discussion WHERE DscName LIKE '%${searchTerm}%'`;

            const result = await connection.request().query(sqlQuery);
            return result.recordset;
        } catch (error) {
            throw new Error("Error searching discussions");
        } finally {
            await connection.close();
        }
    }
}

module.exports = Discussion;