//User stats model contains crud operations to get counts or data from several tables
 const sql =  require("mssql");
 const dbConfig = require("../../dbConfig");
 const { request } = require("express");
 
 
 
 class Statistic {
     constructor(count, dscname) {
        this.count = count;
        this.dscname = dscname;
     }
 
    
     //Gets count of users banned
     static async getCountOfUsersBanned() {
         
         const connection = await sql.connect(dbConfig);
       
        
         const allQuery = 
         `SELECT COUNT(*) AS 'Count' From Account WHERE isBanned = 'True'`;
     
         
         const request = connection.request();
         const result = await request.query(allQuery);
         connection.close();
         return result.recordset.map((row) => new Statistic(row.Count));
     }
 
     //Gets count of users
     static async getCountOfUsers() {
         
        const connection = await sql.connect(dbConfig);
        
       
        const allQuery = 
        `SELECT COUNT(*) AS 'Count' From Account`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));
    }

    //Gets count of users muted
    static async getCountOfUsersMuted() {
         
        const connection = await sql.connect(dbConfig);
      
       
        const allQuery = 
        `SELECT COUNT(*) AS 'Count' From Account WHERE isMuted = 'True'`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));
    }

     //Gets count of admins
    static async getCountOfAdminUsers() {
         
        const connection = await sql.connect(dbConfig);
      
       
        const allQuery = 
        `SELECT COUNT(*) AS 'Count' From Account WHERE isAdmin = 'True'`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));
    }

     //Gets count of comments
    static async getCountOfComments() {
         
        const connection = await sql.connect(dbConfig);
      
       
        const allQuery = 
        `SELECT COUNT(*) AS 'Count' From Comment`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));
    }

     //Gets count of discussions
    static async getCountOfDiscussions() {
         
        const connection = await sql.connect(dbConfig);
      
       
        const allQuery = 
        `SELECT COUNT(*) AS 'Count' From Discussion`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));
    }

     //Gets count of posts
    static async getCountOfPosts() {
         
        const connection = await sql.connect(dbConfig);
      
       
        const allQuery = 
        `SELECT COUNT(*) AS 'Count' From Post`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));
    }

     //Gets count of post reports
    static async getCountOfPostReports() {
         
        const connection = await sql.connect(dbConfig);
      
       
        const allQuery = 
        `SELECT COUNT(*) AS 'Count' From PostReport`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));
    }

     //Gets count of discussion reports
    static async getCountOfDiscussionReports() {
         
        const connection = await sql.connect(dbConfig);
      
       
        const allQuery = 
        `SELECT COUNT(*) AS 'Count' From DiscussionReport`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));
    }


    //Gets count of discussion admins
    static async getCountOfDiscussionAdmins() {
         
        const connection = await sql.connect(dbConfig);
      
       
        const allQuery = 
        `SELECT COUNT(*) AS 'Count' From DiscussionAdmin`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));
    }

     //Gets count of discussions and discussion names
    static async getTypeOfDiscussions(){
        const connection = await sql.connect(dbConfig);
        const allQuery = 
        `SELECT Discussion.DscName, COUNT(Discussion.DscName) AS 'Count' From Discussion
         INNER JOIN Post ON Discussion.DscName = Post.DscName
         GROUP BY Discussion.DscName`;    
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count, row.DscName));



    }



    }
 
 module.exports = Statistic;