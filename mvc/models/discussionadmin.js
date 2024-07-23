const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class DiscussionAdmin {
    constructor(dscAdmID, accName, dscName) {
        this.dscAdmID = dscAdmID;
        this.accName = accName;
        this.dscName = dscName;
    }

    static async getAdminsByDiscussion(dscName) {
        try {
            await sql.connect(dbConfig);
            const result = await sql.query`
                SELECT AccName
                FROM discussionadmin
                WHERE DscName = ${dscName}
            `;
            return result.recordset;
        } catch (err) {
            console.error('Error fetching admins:', err);
            throw new Error('Database query failed');
        }
    }
}

module.exports = DiscussionAdmin;