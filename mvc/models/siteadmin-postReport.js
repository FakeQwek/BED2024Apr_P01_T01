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

   
    //Gets all data necessary for post reports
    static async getAllPostReports() {
        
        const connection = await sql.connect(dbConfig);
        //Inner join gets related data from account and post tables
       
        const allQuery = 
        `SELECT PostRptID, PostRptDesc, PostName, PostReport.AccName, Post.PostID
            FROM PostReport
            INNER JOIN Post 
            ON PostReport.PostID = Post.PostID
            INNER JOIN Account
            ON PostReport.AccName = Account.AccName;`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new PostReport(row.PostRptID, row.AccName, row.PostRptDesc, row.PostName, row.PostID));
    }

    //Deletes post report based on id
    static async deletePostReport(reportId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM PostReport WHERE PostRptID = @reportId`;

        const request = connection.request();
        request.input("reportId", reportId);
        const result = await request.query(sqlQuery);

        connection.close();
    }

    //Deletes post based on id
    static async denyPost(postId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE Post SET isApproved = 'False' WHERE PostID = @postId`;
        const request = connection.request();
        request.input("postId", postId);
        const result = await request.query(sqlQuery);
        connection.close();

    }

    //Gets post report data by newest 
    static async getAllPostReportsByNewest() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT PostRptID, PostRptDesc, PostName, PostReport.AccName, Post.PostID
            FROM PostReport
            INNER JOIN Post 
            ON PostReport.PostID = Post.PostID
            INNER JOIN Account
            ON PostReport.AccName = Account.AccName
            ORDER BY PostRptID DESC`;
        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new PostReport(row.PostRptID, row.AccName, row.PostRptDesc, row.PostName, row.PostID));
    }

    //Get post reports by id
    static async getPostReportById(postId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT PostRptID, PostRptDesc, PostName, PostReport.AccName, Post.PostID
            FROM PostReport
            INNER JOIN Post 
            ON PostReport.PostID = Post.PostID
            INNER JOIN Account
            ON PostReport.AccName = Account.AccName
            WHERE PostReport.PostID = @postId`;
        const request = connection.request();
        request.input("postId", postId);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map((row) => new PostReport(row.PostRptID, row.AccName, row.PostRptDesc, row.PostName, row.PostID));
    }

    //Gets post report data grouped by post id to get most reported posts
    static async getAllCountOfPostReports() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT COUNT(PostID) AS 'Count', PostId From PostReport GROUP BY PostID ORDER BY Count ASC`;
        const request = connection.request();
        const result = await request.query(sqlQuery);   

        connection.close();
        console.log(result.recordset);
        return result.recordset;

    }
}

module.exports = PostReport;