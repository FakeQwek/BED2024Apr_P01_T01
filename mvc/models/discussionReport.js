// imports
const sql = require("mssql");
const dbConfig = require("../../dbConfig");

// discussion report class
class DiscussionReport {
    // discussion report constructor
    constructor(dscRptId, dscRptCat, dscRptDesc, accName, dscName) {
        this.dscRptId = dscRptId;
        this.dscRptCat = dscRptCat;
        this.dscRptDesc = dscRptDesc;
        this.accName = accName;
        this.dscName = dscName;
    }

    // get all discussion reports
    static async getAllDiscussionReports() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM DiscussionReport`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map((row) => new DiscussionReport(row.DscRptID, row.DscRptCat, row.DscRptDesc, row.AccName, row.DscName));
    }

    // get discussion report by discussion report id
    static async getDiscussionReportById(dscRptId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM DiscussionReport WHERE DscRptID = @dscRptId`;
        const request = connection.request();
        request.input("dscRptId", sql.VarChar, dscRptId); // Treat as varchar
        const result = await request.query(sqlQuery);
        connection.close();

        // Log the SQL query and result
        console.log(`Executed Query: ${sqlQuery}`);
        console.log(`Query Result: `, result.recordset[0]);

        return result.recordset[0]
            ? new DiscussionReport(
                result.recordset[0].DscRptID,
                result.recordset[0].DscRptCat,
                result.recordset[0].DscRptDesc,
                result.recordset[0].AccName,
                result.recordset[0].DscName
            )
            : null;
    }

    // create discussion report
    static async createDiscussionReport(newDiscussionReportData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO DiscussionReport (DscRptID, DscRptCat, DscRptDesc, AccName, DscName) 
                          SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE MAX(DscRptID) + 1 END, @dscRptCat, @dscRptDesc, @accName, @dscName FROM DiscussionReport`;
        const request = connection.request();
        request.input("dscRptCat", newDiscussionReportData.dscRptCat);
        request.input("dscRptDesc", newDiscussionReportData.dscRptDesc);
        request.input("accName", newDiscussionReportData.accName);
        request.input("dscName", newDiscussionReportData.dscName);
        await request.query(sqlQuery);
        connection.close();
    }

    // warn discussion report
    static async warnDiscussionReport(dscRptId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE DiscussionReport SET Warned = 1 WHERE DscRptID = @dscRptId`;
        const request = connection.request();
        request.input("dscRptId", sql.VarChar, dscRptId); // Treat as varchar
        await request.query(sqlQuery);
        connection.close();
    }

    static async deleteDiscussionReport(dscRptId) {
        const connection = await sql.connect(dbConfig);
    
        // Begin transaction
        const transaction = new sql.Transaction(connection);
        await transaction.begin();
    
        try {
            // Get the discussion name associated with the report
            const getDscNameQuery = `SELECT DscName FROM DiscussionReport WHERE DscRptID = @dscRptId`;
            const getRequest = transaction.request();
            getRequest.input("dscRptId", sql.VarChar, dscRptId); // Treat as varchar
            const result = await getRequest.query(getDscNameQuery);
    
            if (result.recordset.length === 0) {
                connection.close();
                throw new Error("Discussion report not found");
            }
    
            const dscName = result.recordset[0].DscName;
    
            // Delete related records in the correct order
            const deletePostLikesQuery = `DELETE FROM PostLike WHERE PostID IN (SELECT PostID FROM Post WHERE DscName = @dscName)`;
            await transaction.request().input("dscName", sql.VarChar, dscName).query(deletePostLikesQuery);
    
            const deleteCommentsQuery = `DELETE FROM Comment WHERE PostID IN (SELECT PostID FROM Post WHERE DscName = @dscName)`;
            await transaction.request().input("dscName", sql.VarChar, dscName).query(deleteCommentsQuery);
    
            const deletePostsQuery = `DELETE FROM Post WHERE DscName = @dscName`;
            await transaction.request().input("dscName", sql.VarChar, dscName).query(deletePostsQuery);
    
            const deleteBanInfoQuery = `DELETE FROM BanInfo WHERE DscName = @dscName`;
            await transaction.request().input("dscName", sql.VarChar, dscName).query(deleteBanInfoQuery);
    
            const deleteDiscussionReportQuery = `DELETE FROM DiscussionReport WHERE DscRptID = @dscRptId`;
            await transaction.request().input("dscRptId", sql.VarChar, dscRptId).query(deleteDiscussionReportQuery);
    
            const deleteDiscussionQuery = `DELETE FROM Discussion WHERE DscName = @dscName`;
            await transaction.request().input("dscName", sql.VarChar, dscName).query(deleteDiscussionQuery);
    
            // Commit transaction
            await transaction.commit();
        } catch (error) {
            // Rollback transaction in case of error
            await transaction.rollback();
            throw error;
        } finally {
            connection.close();
        }
    }
}

// export discussion report
module.exports = DiscussionReport;
