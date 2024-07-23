const sql =  require("mssql");
const dbConfig = require("../../dbConfig");
const { request } = require("express");

class PostLike {
    constructor(postLikeId, accName, postId) {
        this.postLikeId = postLikeId;
        this.accName = accName;
        this.postId = postId;
    }

    static async getAllPostLikes() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM PostLike`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new PostLike(row.PostLikeID, row.AccName, row.PostID));
    }

    static async getPostLikesByPost(postId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM PostLike WHERE PostID = @postId`;

        const request = connection.request();
        request.input("postId", postId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new PostLike(row.PostLikeID, row.AccName, row.PostID));
    }

    static async createPostLike(newPostLikeData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO PostLike (PostLikeID, AccName, PostID) SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE MAX(PostLikeID) + 1 END, @accName, @postId FROM PostLike;`;

        const request = connection.request();
        request.input("accName", newPostLikeData.accName);
        request.input("postId", newPostLikeData.postId);

        const result = await request.query(sqlQuery);

        connection.close();
    }

    static async deletePostLike(accName, postId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM PostLike WHERE AccName = @accName AND PostID = @postId;`;

        const request = connection.request();
        request.input("accName", accName);
        request.input("postId", postId);

        const result = await request.query(sqlQuery);

        connection.close();

        return result;
    }
}

module.exports = PostLike;