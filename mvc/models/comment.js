const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class Comment {
    constructor(cmtId, cmtDesc, ownerId, postId) {
        this.cmtId = cmtId;
        this.cmtDesc = cmtDesc;
        this.ownerId = ownerId;
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
        request.input("postId", postId);
        const result = await request.query(sqlQuery);
        connection.close();

        return result.recordset.map(row => new Comment(row.CmtID, row.CmtDesc, row.OwnerID, row.PostID));
    }

    static async createComment(newCommentData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Comment (CmtID, CmtDesc, OwnerID, PostID) 
                          SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE MAX(CmtID) + 1 END, @cmtDesc, @ownerId, @postId FROM Comment;`;

        const request = connection.request();
        request.input("cmtDesc", newCommentData.cmtDesc);
        request.input("ownerId", newCommentData.ownerId);
        request.input("postId", newCommentData.postId);
        await request.query(sqlQuery);
        connection.close();
    }

    static async updateComment(cmtId, newCommentData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Comment SET CmtDesc = @cmtDesc WHERE CmtID = @cmtId`;

        const request = connection.request();
        request.input("cmtId", cmtId);
        request.input("cmtDesc", newCommentData.cmtDesc || null);

        await request.query(sqlQuery);
        connection.close();
    }

    static async deleteComment(cmtId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM Comment WHERE CmtID = @cmtId`;

        const request = connection.request();
        request.input("cmtId", cmtId);

        await request.query(sqlQuery);
        connection.close();
    }
}

module.exports = Comment;
