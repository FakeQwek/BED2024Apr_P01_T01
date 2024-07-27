const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class Comment {
    constructor(cmtId, cmtDesc, accName, postId) {
        this.cmtId = cmtId;
        this.cmtDesc = cmtDesc;
        this.accName = accName;
        this.postId = postId;
    }

    static async getAllComments() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Comment`;
        const result = await connection.request().query(sqlQuery);
        connection.close();

        return result.recordset.map(row => new Comment(row.CmtID, row.CmtDesc, row.OwnerID, row.PostID));
    }

    static async getCommentsByPost(postId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Comment WHERE PostID = @postId`;
        const request = connection.request();
        request.input("postId", sql.VarChar, postId);
        const result = await request.query(sqlQuery);
        connection.close();

        return result.recordset.map(row => new Comment(row.CmtID, row.CmtDesc, row.OwnerID, row.PostID));
    }

    static async getCommentOwnerByCommentId(cmtId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT OwnerID FROM Comment WHERE CmtID = @cmtId`;
        const request = connection.request();
        request.input("cmtId", sql.VarChar, cmtId);
        const result = await request.query(sqlQuery);
        connection.close();

        return result.recordset[0].OwnerID; 
    }

    static async getCommentsByUser(username) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Comment WHERE OwnerID = @username`;
        const request = connection.request();
        request.input('username', sql.VarChar, username);
        const result = await request.query(sqlQuery);
        connection.close();

        return result.recordset.map(row => new Comment(row.CmtID, row.CmtDesc, row.OwnerID, row.PostID));
    }


    static async createComment(newCommentData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Comment (CmtID, CmtDesc, OwnerID, PostID) 
                          SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE MAX(CmtID) + 1 END, @cmtDesc, @accName, @postId FROM Comment;`;

        const request = connection.request();
        request.input("cmtDesc", sql.VarChar, newCommentData.cmtDesc);
        request.input("accName", sql.VarChar, newCommentData.accName);
        request.input("postId", sql.VarChar, newCommentData.postId);
        await request.query(sqlQuery);
        connection.close();
    }

    static async updateComment(cmtId, newCommentData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Comment SET CmtDesc = @cmtDesc WHERE CmtID = @cmtId`;

        const request = connection.request();
        request.input("cmtId", sql.VarChar, cmtId);
        request.input("cmtDesc", sql.VarChar, newCommentData.cmtDesc || null);

        const result = await request.query(sqlQuery);
        
        connection.close();

        return result;
    }

    static async deleteComment(cmtId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM Comment WHERE CmtID = @cmtId`;

        const request = connection.request();
        request.input("cmtId", sql.VarChar, cmtId);

        await request.query(sqlQuery);
        connection.close();
    }

    static async deleteCommentsByPost(postId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM Comment WHERE PostID = @postId`;

        const request = connection.request();
        request.input("postId", sql.VarChar, postId);

        await request.query(sqlQuery);
        connection.close();
    }
}

module.exports = Comment;
