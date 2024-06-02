const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class PostReport {
    constructor(postRptId, postRptCat, postRptDesc, accId, postId) {
        this.postRptId = postRptId;
        this.postRptCat = postRptCat;
        this.postRptDesc = postRptDesc;
        this.accId = accId;
        this.postId = postId;
    }

    static async getAllPostReports() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM PostReport`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new PostReport(row.PostRptID, row.PostRptCat, row.PostRptDesc, row.AccID, row.PostID));
    }

    static async getPostReportById(postRptId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM PostReport WHERE PostRptID = @postRptId`;

        const request = connection.request();
        request.input("postRptId", postRptId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new PostReport(
                result.recordset[0].PostRptID,
                result.recordset[0].PostRptCat,
                result.recordset[0].PostRptDesc,
                result.recordset[0].AccID,
                result.recordset[0].PostID
            )
            : null;
    }

    static async createPostReport(newPostReportData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO PostReport (PostRptID, PostRptCat, PostRptDesc, AccID, PostID) SELECT MAX(PostRptID) + 1, @postRptCat, @postRptDesc, @accId, @postId FROM PostReport;`;

        const request = connection.request();
        request.input("postRptCat", newPostReportData.postRptCat);
        request.input("postRptDesc", newPostReportData.postRptDesc);
        request.input("accId", newPostReportData.accId);
        request.input("postId", newPostReportData.postId);

        const result = await request.query(sqlQuery);

        connection.close();
    }
}

module.exports = PostReport;