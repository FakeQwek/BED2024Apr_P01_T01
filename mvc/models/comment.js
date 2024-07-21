// imports
const sql = require("mssql");
const dbConfig = require("../../dbConfig");

// comment class
class Comment {
    // comment constructor
    constructor(cmtId, cmtDesc, accName, postId) {
        this.cmtId = cmtId;
        this.cmtDesc = cmtDesc;
        this.accName = accName;
        this.postId = postId;
    }

    // get all comments
    static async getAllComments() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Comment`;
        const result = await connection.request().query(sqlQuery);
        connection.close();

        return result.recordset.map(row => new Comment(row.CmtID, row.CmtDesc, row.OwnerID, row.PostID));
    }

    // get comments that belong to post with post id
    static async getCommentsByPost(postId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Comment WHERE PostID = @postId`;
        const request = connection.request();
        request.input("postId", postId);
        const result = await request.query(sqlQuery);
        connection.close();

        return result.recordset.map(row => new Comment(row.CmtID, row.CmtDesc, row.OwnerID, row.PostID));
    }

    // get account name of the owner of comment with comment id
    static async getCommentOwnerByCommentId(cmtId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT OwnerID FROM Comment WHERE CmtID = @cmtId`;
        const request = connection.request();
        request.input("cmtId", cmtId);
        const result = await request.query(sqlQuery);
        connection.close();

        return result.recordset[0].OwnerID; 
    }

    // create comment
    static async createComment(newCommentData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Comment (CmtID, CmtDesc, OwnerID, PostID) 
                          SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE MAX(CmtID) + 1 END, @cmtDesc, @accName, @postId FROM Comment;`;

        const request = connection.request();
        request.input("cmtDesc", newCommentData.cmtDesc);
        request.input("accName", newCommentData.accName);
        request.input("postId", newCommentData.postId);
        await request.query(sqlQuery);
        connection.close();
    }

    // update comment description
    static async updateComment(cmtId, newCommentData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Comment SET CmtDesc = @cmtDesc WHERE CmtID = @cmtId`;

        const request = connection.request();
        request.input("cmtId", cmtId);
        request.input("cmtDesc", newCommentData.cmtDesc || null);

        const result = await request.query(sqlQuery);
        
        connection.close();

        return result;
    }

    // delete comment
    static async deleteComment(cmtId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM Comment WHERE CmtID = @cmtId`;

        const request = connection.request();
        request.input("cmtId", cmtId);

        await request.query(sqlQuery);
        connection.close();
    }
}

// export comment
module.exports = Comment;
