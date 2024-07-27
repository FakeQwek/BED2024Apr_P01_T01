//Banned users model contains crud operations to manipulate data related to banned users

 const sql =  require("mssql");
 const dbConfig = require("../../dbConfig");
 const { request } = require("express");
 
 
 
 class BannedUsers {
     constructor(accId, accName) {
        this.accId = accId;
        this.accName = accName;
     }
     //Retrieves all users who are banned
     static async getAllBannedUsers() {
         
         const connection = await sql.connect(dbConfig);
         const query = 
         `SELECT AccID, AccName FROM Account WHERE isBanned = 'True'`;
      
         const request = connection.request();
         const result = await request.query(query);
         connection.close();
         return result.recordset.map((row) => new BannedUsers(row.AccID, row.AccName));
     }

     //Retrieves all users by name (user will search for user)
     static async getBannedUsersByName(accName) {
        
        const connection = await sql.connect(dbConfig);
        //Gets the banned user with AccName containing characters from input accName
        const query = 
        `SELECT AccID, AccName FROM Account WHERE AccName LIKE '%${accName}%' AND isBanned ='True'`;
    
        const request = connection.request();
        request.input("accName", accName);
        const result = await request.query(query);
        connection.close();
        return result.recordset.map((row) => new BannedUsers(row.AccID, row.AccName));
     }

     //Put operation sets Account isBanned to false, unbanning the user
     static async unbanUser(accId) {
        const connection = await sql.connect(dbConfig);
        const query = 
        `UPDATE Account SET isBanned = 'False' WHERE AccId = @accId`;
    
        const request = connection.request();
        request.input("accId", accId);
        const result = await request.query(query);
        connection.close();

     }
 
     
    
 }
 
 module.exports = BannedUsers;