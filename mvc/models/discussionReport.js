const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class DiscussionReport {
    constructor(dscRptId, dscRptCat, dscRptDesc, accName, dscName, warned) {
        this.dscRptId = dscRptId;
        this.dscRptCat = dscRptCat;
        this.dscRptDesc = dscRptDesc;
        this.accName = accName;
        this.dscName = dscName;
        this.warned = warned;
    }

    static async getAllDiscussionReports() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM DiscussionReport`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map((row) => new DiscussionReport(row.DscRptID, row.DscRptCat, row.DscRptDesc, row.AccName, row.DscName, row.Warned));
    }

    static async getDiscussionReportById(dscRptId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM DiscussionReport WHERE DscRptID = @dscRptId`;
        const request = connection.request();
        request.input("dscRptId", dscRptId);
        const result = await request.query(sqlQuery);
        connection.close();

        return result.recordset[0]
            ? new DiscussionReport(
                result.recordset[0].DscRptID,
                result.recordset[0].DscRptCat,
                result.recordset[0].DscRptDesc,
                result.recordset[0].AccName,
                result.recordset[0].DscName,
                result.recordset[0].Warned
            )
            : null;
    }

    static async createDiscussionReport(newDiscussionReportData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO DiscussionReport (DscRptID, DscRptCat, DscRptDesc, AccName, DscName, Warned) 
                          SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE MAX(DscRptID) + 1 END, @dscRptCat, @dscRptDesc, @accName, @dscName, 0 FROM DiscussionReport`;
        const request = connection.request();
        request.input("dscRptCat", newDiscussionReportData.dscRptCat);
        request.input("dscRptDesc", newDiscussionReportData.dscRptDesc);
        request.input("accName", newDiscussionReportData.accName);
        request.input("dscName", newDiscussionReportData.dscName);
        await request.query(sqlQuery);
        connection.close();
    }

    static async warnDiscussionReport(dscRptId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE DiscussionReport SET Warned = 1 WHERE DscRptID = @dscRptId`;
        const request = connection.request();
        request.input("dscRptId", dscRptId);
        await request.query(sqlQuery);
        connection.close();
    }

    static async deleteDiscussionReport(dscRptId) {
        const connection = await sql.connect(dbConfig);
    
        const getDscNameQuery = `SELECT DscName FROM DiscussionReport WHERE DscRptID = @dscRptId`;
        const getRequest = connection.request();
        getRequest.input("dscRptId", dscRptId);
        const result = await getRequest.query(getDscNameQuery);
    
        if (result.recordset.length === 0) {
            connection.close();
            throw new Error("Discussion report not found");
        }
    
        const dscName = result.recordset[0].DscName;
    
        const transaction = new sql.Transaction(connection);
        await transaction.begin();
    
        try {
            const deleteCommentsQuery = `DELETE FROM Comment WHERE PostID IN (SELECT PostID FROM Post WHERE DscName = @dscName)`;
            const deleteCommentsRequest = transaction.request();
            deleteCommentsRequest.input("dscName", dscName);
            await deleteCommentsRequest.query(deleteCommentsQuery);
    
            const deletePostsQuery = `DELETE FROM Post WHERE DscName = @dscName`;
            const deletePostsRequest = transaction.request();
            deletePostsRequest.input("dscName", dscName);
            await deletePostsRequest.query(deletePostsQuery);
    
            const deleteReportQuery = `DELETE FROM DiscussionReport WHERE DscRptID = @dscRptId`;
            const deleteReportRequest = transaction.request();
            deleteReportRequest.input("dscRptId", dscRptId);
            await deleteReportRequest.query(deleteReportQuery);
    
            const deleteDiscussionQuery = `DELETE FROM Discussion WHERE DscName = @dscName`;
            const deleteDiscussionRequest = transaction.request();
            deleteDiscussionRequest.input("dscName", dscName);
            await deleteDiscussionRequest.query(deleteDiscussionQuery);
    
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        } finally {
            connection.close();
        }
    }
}

module.exports = DiscussionReport;

