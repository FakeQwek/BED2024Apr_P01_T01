// imports
const sql = require("mssql");
const dbConfig = require("../../dbConfig");

// post report class
class PostReport {
    // post report constructor
    constructor(postRptId, postRptCat, postRptDesc, accName, postId) {
        this.postRptId = postRptId;
        this.postRptCat = postRptCat;
        this.postRptDesc = postRptDesc;
        this.accName = accName;
        this.postId = postId;
    }

    // get all post reports
    static async getAllPostReports() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM PostReport`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new PostReport(row.PostRptID, row.PostRptCat, row.PostRptDesc, row.AccName, row.PostID));
    }

    // get post report by post report id
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
                result.recordset[0].AccName,
                result.recordset[0].PostID
            )
            : null;
    }

    // create post report
    static async createPostReport(newPostReportData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO PostReport (PostRptID, PostRptCat, PostRptDesc, AccName, PostID) SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE MAX(PostRptID) + 1 END, @postRptCat, @postRptDesc, @accName, @postId FROM PostReport;`;

        const request = connection.request();
        request.input("postRptCat", newPostReportData.postRptCat);
        request.input("postRptDesc", newPostReportData.postRptDesc);
        request.input("accName", newPostReportData.accName);
        request.input("postId", newPostReportData.postId);

        const result = await request.query(sqlQuery);

        connection.close();
    }
}

// export post report
module.exports = PostReport;