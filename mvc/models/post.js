const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class Post {
    constructor(postId, postName, postDesc, isEvent, isApproved, postDate, postEventDate, accName, dscName) {
        this.postId = postId;
        this.postName = postName;
        this.postDesc = postDesc;
        this.isEvent = isEvent;
        this.isApproved = isApproved;
        this.postDate = postDate;
        this.postEventDate = postEventDate;
        this.accName = accName;
        this.dscName = dscName;
    }

    static async getAllPosts() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Post`;
        const result = await connection.request().query(sqlQuery);
        connection.close();

        return result.recordset.map((row) => new Post(row.PostID, row.PostName, row.PostDesc, row.isEvent, row.isApproved, row.PostDate, row.PostEventDate, row.OwnerID, row.DscName));
    }

    static async getAllPublicPosts() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT p.* FROM Post p JOIN Discussion d ON p.DscName = d.DscName AND d.DscType = 'Public'`;
        const result = await connection.request().query(sqlQuery);
        connection.close();

        return result.recordset.map((row) => new Post(row.PostID, row.PostName, row.PostDesc, row.isEvent, row.isApproved, row.PostDate, row.PostEventDate, row.OwnerID, row.DscName));
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
                result.recordset[0].PostDate,
                result.recordset[0].PostEventDate,
                result.recordset[0].OwnerID,
                result.recordset[0].DscName
            )
            : null;
    }

    static async getPostOwnerByPostId(postId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT OwnerID FROM Post WHERE PostID = @postId`;
        const request = connection.request();
        request.input("postId", postId);
        const result = await request.query(sqlQuery);
        connection.close();

        return result.recordset[0] ? result.recordset[0].OwnerID : null;
    }

    static async getPostsByDiscussion(dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Post WHERE DscName = @dscName`;
        const request = connection.request();
        request.input("dscName", dscName);
        const result = await request.query(sqlQuery);
        connection.close();

        return result.recordset.map((row) => new Post(row.PostID, row.PostName, row.PostDesc, row.isEvent, row.isApproved, row.PostDate, row.PostEventDate, row.OwnerID, row.DscName));
    }

    static async getPostsByDiscussionOrderByLikes(dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT Post.PostID, Post.PostName, Post.PostDesc, Post.isEvent, Post.isApproved, Post.PostDate, Post.PostEventDate, Post.OwnerID, Post.DscName, COUNT(PostLike.PostLikeID) AS LikeCount FROM Post
                          LEFT JOIN PostLike ON Post.PostID = PostLike.PostID
                          WHERE Post.DscName = @dscName
                          GROUP BY Post.PostID, Post.PostName, Post.PostDesc, Post.isEvent, Post.isApproved, Post.PostDate, Post.PostEventDate, Post.OwnerID, Post.DscName
                          ORDER BY LikeCount DESC`;
        const request = connection.request();
        request.input("dscName", dscName);
        const result = await request.query(sqlQuery);
        connection.close();

        return result.recordset.map((row) => new Post(row.PostID, row.PostName, row.PostDesc, row.isEvent, row.isApproved, row.PostDate, row.PostEventDate, row.OwnerID, row.DscName));
    }

    static async getPostsByDiscussionOrderByPostDate(dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Post WHERE DscName = @dscName ORDER BY CONVERT(DATE, PostDate, 103) DESC`;
        const request = connection.request();
        request.input("dscName", dscName);
        const result = await request.query(sqlQuery);
        connection.close();

        return result.recordset.map((row) => new Post(row.PostID, row.PostName, row.PostDesc, row.isEvent, row.isApproved, row.PostDate, row.PostEventDate, row.OwnerID, row.DscName));
    }

    static async getUnapprovedPostsByDiscussion(dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Post WHERE DscName = @dscName AND isApproved = 'False'`;
        const request = connection.request();
        request.input("dscName", dscName);
        const result = await request.query(sqlQuery);
        connection.close();

        return result.recordset.map((row) => new Post(row.PostID, row.PostName, row.PostDesc, row.isEvent, row.isApproved, row.PostDate, row.PostEventDate, row.OwnerID, row.DscName));
    }

    static async getPostsByUser(username) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Post WHERE OwnerID = @username`;
        const request = connection.request();
        request.input("username", sql.VarChar, username);
        const result = await request.query(sqlQuery);
        connection.close();
    
        return result.recordset.map((row) => ({
            PostName: row.PostName,
            PostDesc: row.PostDesc,
            OwnerID: row.OwnerID
        }));
    }
    
    
    

    static async createPost(newPostData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO Post (PostID, PostName, PostDesc, isEvent, isApproved, PostDate, PostEventDate, OwnerID, DscName) 
                          SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE MAX(PostID) + 1 END, @postName, @postDesc, @isEvent, 'False', @postDate, @postEventDate, @accName, @dscName FROM Post`;
        const request = connection.request();
        request.input("postName", newPostData.postName);
        request.input("postDesc", newPostData.postDesc);
        request.input("isEvent", newPostData.isEvent);
        request.input("postDate", newPostData.postDate);
        request.input("postEventDate", newPostData.postEventDate);
        request.input("accName", newPostData.accName);
        request.input("dscName", newPostData.dscName);
        await request.query(sqlQuery);
        connection.close();
    }

    static async updatePost(postId, newPostData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE Post SET PostName = @postName, PostDesc = @postDesc, isEvent = @isEvent, PostEventDate = @postEventDate WHERE PostID = @postId`;
        const request = connection.request();
        request.input("postId", postId);
        request.input("postName", newPostData.postName || null);
        request.input("postDesc", newPostData.postDesc || null);
        request.input("isEvent", newPostData.isEvent);
        request.input("postEventDate", newPostData.postEventDate);
        await request.query(sqlQuery);
        connection.close();

        return this.getPostById(postId);
    }

    static async deletePost(postId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM Post WHERE PostID = @postId`;
        const request = connection.request();
        request.input("postId", postId);
        await request.query(sqlQuery);
        connection.close();
    }

    static async approvePost(postId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE Post SET isApproved = 'True' WHERE PostID = @postId`;
        const request = connection.request();
        request.input("postId", postId);
        await request.query(sqlQuery);
        connection.close();
    }
}

module.exports = Post;
