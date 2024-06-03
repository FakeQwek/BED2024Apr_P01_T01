const sql =  require("mssql");
const dbConfig = require("../../dbConfig");
const { request } = require("express");

class Post {
    constructor(postId, postName, postDesc, isEvent, isApproved, accName, dscName) {
        this.postId = postId;
        this.postName = postName;
        this.postDesc = postDesc;
        this.isEvent = isEvent;
        this.isApproved = isApproved;
        this.accName = accName;
        this.dscName = dscName;
    }

    static async getAllPosts() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Post`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new Post(row.PostID, row.PostName, row.PostDesc, row.isEvent, row.isApproved, row.AccName, row.DscName));
    }

    static async getPostById(postId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Post WHERE PostID = @postId`;

        const request = connection.request();
        request.input("postId", postId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new Post(
                result.recordset[0].PostID,
                result.recordset[0].PostName,
                result.recordset[0].PostDesc,
                result.recordset[0].isEvent,
                result.recordset[0].isApproved,
                result.recordset[0].AccName,
                result.recordset[0].DscName
            )
            : null;
    }

    static async getPostsByDiscussion(dscName) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Post WHERE DscName = @dscName`;

        const request = connection.request();
        request.input("dscName", dscName);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new Post(row.PostID, row.PostName, row.PostDesc, row.isEvent, row.isApproved, row.AccName, row.DscName));
    }

    static async createPost(newPostData) {
        const connection = await sql.connect(dbConfig);
        
        const sqlQuery = `INSERT INTO Post (PostID, PostName, PostDesc, isEvent, isApproved, AccName, DscName) SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE MAX(PostID) + 1 END, @postName, @postDesc, @isEvent, 'False', @accName, @dscName FROM Post;`;

        const request = connection.request();
        request.input("postName", newPostData.postName);
        request.input("postDesc", newPostData.postDesc);
        request.input("isEvent", newPostData.isEvent);
        request.input("accName", newPostData.accName);
        request.input("dscName", newPostData.dscName);

        const result = await request.query(sqlQuery);

        connection.close();
    }

    static async updatePost(postId, newPostData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Post SET PostName = @postName, PostDesc = @postDesc WHERE PostID = @postId`;

        const request = connection.request();
        request.input("postId", postId);
        request.input("postName", newPostData.postName || null);
        request.input("postDesc", newPostData.postDesc || null);

        await request.query(sqlQuery);

        connection.close()

        return this.getPostById(postId);
    }

    static async deletePost(postId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM Comment WHERE PostID = @postId; DELETE FROM PostReport WHERE PostID = @postId; DELETE FROM Volunteer WHERE PostID = @postId; DELETE FROM Post WHERE PostID = @postId`;

        const request = connection.request();
        request.input("postId", postId);
        const result = await request.query(sqlQuery);

        connection.close();
    }
}

module.exports = Post;