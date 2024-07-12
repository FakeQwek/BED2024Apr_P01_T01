const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class Post {
    constructor(postId, postName, postDesc, isEvent, isApproved, ownerID, dscName) {
        this.postId = postId;
        this.postName = postName;
        this.postDesc = postDesc;
        this.isEvent = isEvent;
        this.isApproved = isApproved;
        this.ownerID = ownerID;
        this.dscName = dscName;
    }

    static async getAllPosts() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Post`;
        const result = await connection.request().query(sqlQuery);
        connection.close();
        return result.recordset.map(row => new Post(row.PostID, row.PostName, row.PostDesc, row.isEvent, row.isApproved, row.OwnerID, row.DscName));
    }

    static async getPostById(postId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Post WHERE PostID = @postId`;
        const request = connection.request();
        request.input("postId", postId);
        const result = await request.query(sqlQuery);
        connection.close();
        if (result.recordset.length > 0) {
            const row = result.recordset[0];
            return new Post(row.PostID, row.PostName, row.PostDesc, row.isEvent, row.isApproved, row.OwnerID, row.DscName);
        } else {
            return null;
        }
    }

    static async getPostsByDiscussion(dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Post WHERE DscName = @dscName`;
        const request = connection.request();
        request.input("dscName", dscName);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map(row => new Post(row.PostID, row.PostName, row.PostDesc, row.isEvent, row.isApproved, row.OwnerID, row.DscName));
    }

    static async getUnapprovedPostsByDiscussion(dscName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Post WHERE DscName = @dscName AND isApproved = 'False'`;
        const request = connection.request();
        request.input("dscName", dscName);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map(row => new Post(row.PostID, row.PostName, row.PostDesc, row.isEvent, row.isApproved, row.OwnerID, row.DscName));
    }

    static async createPost(newPostData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO Post (PostID, PostName, PostDesc, isEvent, isApproved, OwnerID, DscName)
                          VALUES (@postId, @postName, @postDesc, @isEvent, @isApproved, @ownerID, @dscName)`;
        const request = connection.request();
        request.input("postId", newPostData.postId);
        request.input("postName", newPostData.postName);
        request.input("postDesc", newPostData.postDesc);
        request.input("isEvent", newPostData.isEvent);
        request.input("isApproved", newPostData.isApproved);
        request.input("ownerID", newPostData.ownerID);
        request.input("dscName", newPostData.dscName);
        await request.query(sqlQuery);
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
