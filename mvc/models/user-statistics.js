//Note id is equivalent to name
 //Add post dates later
 const sql =  require("mssql");
 const dbConfig = require("../../dbConfig");
 const { request } = require("express");
 
 
 
 class Statistic {
     constructor(count, dscname) {
        this.count = count;
        this.dscname = dscname;
     }
 
    
 
     static async getCountOfUsersBanned() {
         
         const connection = await sql.connect(dbConfig);
       
        
         const allQuery = 
         `SELECT COUNT(*) AS 'Count' From Account WHERE isBanned = 'True'`;
     
         
         const request = connection.request();
         const result = await request.query(allQuery);
         connection.close();
         return result.recordset.map((row) => new Statistic(row.Count));
     }
 
     static async getCountOfUsers() {
         
        const connection = await sql.connect(dbConfig);
        
       
        const allQuery = 
        `SELECT COUNT(*) AS 'Count' From Account`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));
    }

    static async getCountOfUsersMuted() {
         
        const connection = await sql.connect(dbConfig);
      
       
        const allQuery = 
        `SELECT COUNT(*) AS 'Count' From Account WHERE isMuted = 'True'`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));
    }

    static async getCountOfAdminUsers() {
         
        const connection = await sql.connect(dbConfig);
      
       
        const allQuery = 
        `SELECT COUNT(*) AS 'Count' From Account WHERE isAdmin = 'True'`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));
    }

    static async getCountOfComments() {
         
        const connection = await sql.connect(dbConfig);
      
       
        const allQuery = 
        `SELECT COUNT(*) AS 'Count' From Comment`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));
    }

    static async getCountOfDiscussions() {
         
        const connection = await sql.connect(dbConfig);
      
       
        const allQuery = 
        `SELECT COUNT(*) AS 'Count' From Discussion`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));
    }

    static async getCountOfPosts() {
         
        const connection = await sql.connect(dbConfig);
      
       
        const allQuery = 
        `SELECT COUNT(*) AS 'Count' From Post`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));
    }

    static async getCountOfPostReports() {
         
        const connection = await sql.connect(dbConfig);
      
       
        const allQuery = 
        `SELECT COUNT(*) AS 'Count' From PostReport`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));
    }

    static async getCountOfDiscussionReports() {
         
        const connection = await sql.connect(dbConfig);
      
       
        const allQuery = 
        `SELECT COUNT(*) AS 'Count' From DiscussionReport`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));
    }



    static async getCountOfDiscussionAdmins() {
         
        const connection = await sql.connect(dbConfig);
      
       
        const allQuery = 
        `SELECT COUNT(*) AS 'Count' From DiscussionAdmin`;
    
        
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));
    }

    static async getTypeOfDiscussions(){
        const connection = await sql.connect(dbConfig);
        const allQuery = 
        `SELECT COUNT(DscName), DscName AS 'Count' From Discussion GROUP BY DscName`;    
        const request = connection.request();
        const result = await request.query(allQuery);
        connection.close();
        return result.recordset.map((row) => new Statistic(row.Count));



    }



    }
 
 module.exports = Statistic;