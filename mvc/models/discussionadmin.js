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

    static async appendAdmin(accName, dscName) {
        try {
            const connection = await sql.connect(dbConfig);
    
            // Query to get the current maximum ID
            const maxIdQuery = `SELECT MAX(CAST(SUBSTRING(DscAdmID, 3, LEN(DscAdmID) - 2) AS INT)) AS MaxID FROM DiscussionAdmin`;
            const maxIdResult = await connection.request().query(maxIdQuery);
    
            // Calculate the new ID
            const maxId = maxIdResult.recordset[0].MaxID || 0; // If there are no existing IDs, start from 0
            const newIdNumber = maxId + 1;
            const newId = `DA${newIdNumber.toString().padStart(3, '0')}`; // Format as DA001, DA002, etc.
    
            // Insert the new admin with the new ID
            const sqlQuery = `INSERT INTO DiscussionAdmin (DscAdmID, AccName, DscName) VALUES (@DscAdmID, @AccName, @DscName)`;
    
            const request = connection.request();
            request.input("DscAdmID", sql.VarChar, newId);
            request.input("AccName", sql.VarChar, accName);
            request.input("DscName", sql.VarChar, dscName);
    
            await request.query(sqlQuery);
    
            connection.close();
        } catch (error) {
            console.error('Error appending admin:', error);
            throw error;
        }
    }

    static async removeAdmin(accName, dscName) {
        try {
            const connection = await sql.connect(dbConfig);
    
            // Delete the admin from the DiscussionAdmin table
            const sqlQuery = `DELETE FROM DiscussionAdmin WHERE AccName = @AccName AND DscName = @DscName`;
    
            const request = connection.request();
            request.input("AccName", sql.VarChar, accName);
            request.input("DscName", sql.VarChar, dscName);
    
            await request.query(sqlQuery);
    
            connection.close();
        } catch (error) {
            console.error('Error removing admin:', error);
            throw error;
        }
    }

    // Methods for PostReport and Post tables
    static async getPostReportsByDiscussion(dscName) {
        try {
            const query = `
                SELECT pr.PostRptID, pr.PostRptCat, pr.PostRptDesc, pr.AccName, pr.PostID, 
                       p.PostName, p.PostDesc, p.isApproved, p.OwnerID, p.DscName
                FROM PostReport pr
                JOIN Post p ON pr.PostID = p.PostID
                WHERE p.DscName = @discussionName;
            `;
            const pool = await sql.connect(dbConfig);
            const result = await pool.request()
                .input('discussionName', sql.VarChar, dscName)
                .query(query);
            return result.recordset;
        } catch (err) {
            console.error('Error fetching post reports:', err);
            throw new Error('Database query failed');
        }
    }
}

module.exports = DiscussionAdmin;