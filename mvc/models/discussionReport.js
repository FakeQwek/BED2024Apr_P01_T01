const sql = require("mssql");
const dbConfig = require("../../dbConfig");
const { request } = require("express");

class DiscussionReport {
    constructor(dscRptId, dscRptCat, dscRptDesc, accName, dscName) {
        this.dscRptId = dscRptId;
        this.dscRptCat = dscRptCat;
        this.dscRptDesc = dscRptDesc;
        this.accName = accName;
        this.dscName = dscName;
    }

    static async getAllDiscussionReports() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM DiscussionReport`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new DiscussionReport(row.DscRptID, row.DscRptCat, row.DscRptDesc, row.AccName, row.DscName));
    }

    static async getDiscussionReportById(dscRptId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM DiscussionReport WHERE DscRptID = @dscRptId`;

        const request = connection.request();

        request.input("dscRptId", dscRptId);

        const result = await request.query(sqlQuery);

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

    static async createDiscussionReport(newDiscussionReportData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO DiscussionReport (DscRptID, DscRptCat, DscRptDesc, AccName, DscName) SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE MAX(DscRptID) + 1 END, @dscRptCat, @dscRptDesc, @accName, @dscName FROM DiscussionReport`;

        const requset = connection.request();
        requset.input("dscRptCat", newDiscussionReportData.dscRptCat);
        requset.input("dscRptDesc", newDiscussionReportData.dscRptDesc);
        request.input("accName", newDiscussionReportData.accName);
        request.input("dscName", newDiscussionReportData.dscName);

        const result = await request.query(sqlQuery);
        
        connection.close();
    }
 }

 module.exports = DiscussionReport;