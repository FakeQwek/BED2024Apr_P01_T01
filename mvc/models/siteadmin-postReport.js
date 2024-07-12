//Note id is equivalent to name
 //Add post dates later
const sql =  require("mssql");
const dbConfig = require("../../dbConfig");
const { request } = require("express");



class PostReport {
    constructor(reportId, accName, reportDesc, postName, postId) {
       this.reportId = reportId;
       this.accName = accName;
       this.reportDesc = reportDesc;
       this.postName = postName;
       this.postId = postId;
    }

    static async getAllPostReports() {
        
        const connection = await sql.connect(dbConfig);
        //This should get all the necessary data for the postreports
       
        const allQuery = 
        `SELECT PostRptID, PostRptDesc, PostName, AccName, Post.PostID
            FROM PostReport
            INNER JOIN Post 
            ON PostReport.PostID = Post.PostID
            INNER JOIN Account
            ON PostReport.AccID = Account.AccID;`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new PostReport(row.PostRptID, row.AccName, row.PostRptDesc, row.PostName, row.PostID));
    }

    //Deletes the PostReports
    static async deletePostReport(reportId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM PostReport WHERE PostRptID = @reportId`;

        const request = connection.request();
        request.input("reportId", reportId);
        const result = await request.query(sqlQuery);

        connection.close();
    }

    static async deletePost(postId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM Post WHERE PostID = @postId`;
        const request = connection.request();
        request.input("postId", postId);
        const result = await request.query(sqlQuery);
        connection.close();

    }
}

module.exports = PostReport;