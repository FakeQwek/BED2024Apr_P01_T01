const sql =  require("mssql");
const dbConfig = require("../../dbConfig");
const { request } = require("express");

class Post {
    constructor(postId, postName, postDesc, isEvent, isApproved, ownerId, dscId) {
        this.postId = postId;
        this.postName = postName;
        this.postDesc = postDesc;
        this.isEvent = isEvent;
        this.isApproved = isApproved;
        this.ownerId = ownerId;
        this.dscId = dscId;
    }

    static async getAllPosts() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Post`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new Post(row.PostID, row.PostName, row.PostDesc, row.isEvent, row.isApproved, row.OwnerID, row.DscID));
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
                result.recordset[0].OwnerID,
                result.recordset[0].DscID
            )
            : null;
    }

    static async createPost(newPostData) {
        const connection = await sql.connect(dbConfig);
        
        const sqlQuery = `INSERT INTO Post (PostID, PostName, PostDesc, isEvent, isApproved, OwnerID, DscID) SELECT MAX(PostID) + 1, @postName, @postDesc, @isEvent, 'False', @ownerId, @dscId FROM Post;`;

        const request = connection.request();
        request.input("postName", newPostData.postName);
        request.input("postDesc", newPostData.postDesc);
        request.input("isEvent", newPostData.isEvent);
        request.input("ownerId", newPostData.ownerId);
        request.input("dscId", newPostData.dscId);

        const result = await request.query(sqlQuery);

        connection.close();
    }
}

module.exports = Post;