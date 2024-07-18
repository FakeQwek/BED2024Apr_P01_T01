
 const sql =  require("mssql");
 const dbConfig = require("../../dbConfig");
 const { request } = require("express");
 
 
 
 class BannedUsers {
     constructor(accId, accName) {
        this.accId = accId;
        this.accName = accName;
     }
 
     static async getAllBannedUsers() {
         
         const connection = await sql.connect(dbConfig);
         const query = 
         `SELECT AccID, AccName FROM Account WHERE isBanned = 'true'`;
      
         const request = connection.request();
         const result = await request.query(query);
         connection.close();
         return result.recordset.map((row) => new BannedUsers(row.AccID, row.AccName));
     }

     static async getBannedUsersByName(accName) {
        
        const connection = await sql.connect(dbConfig);
        const query = 
        `SELECT AccID, AccName FROM Account WHERE AccName LIKE '%${accName}%' AND isBanned ='true'`;
    
        const request = connection.request();
        request.input("accName", accName);
        const result = await request.query(query);
        connection.close();
        return result.recordset.map((row) => new BannedUsers(row.AccID, row.AccName));
     }

     static async unbanUser(accId) {
        const connection = await sql.connect(dbConfig);
        const query = 
        `UPDATE Account SET isBanned = 'false' WHERE AccId = @accId`;
    
        const request = connection.request();
        request.input("accId", accId);
        const result = await request.query(query);
        connection.close();

     }
 
     
    
 }
 
 module.exports = BannedUsers;