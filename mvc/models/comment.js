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

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new Comment(row.CmtID, row.CmtDesc, row.OwnerID, row.PostId));
    }

    static async getCommentsByPost(postId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Comment WHERE PostID = @postId`;

        const request = connection.request();
        request.input("postId", postId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new Comment(row.CmtID, row.CmtDesc, row.OwnerID, row.PostId));
    }
}

module.exports = Comment;