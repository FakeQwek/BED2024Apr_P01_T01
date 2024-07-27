
 const sql =  require("mssql");
 const dbConfig = require("../../dbConfig");
 const { request } = require("express");
 
 
 
 class MutedUsers {
     constructor(accId, accName) {
        this.accId = accId;
        this.accName = accName;
     }
     
     //Retrieves all muted users
     static async getAllMutedUsers() {
         
         const connection = await sql.connect(dbConfig);
         const query = 
         `SELECT AccID, AccName FROM Account WHERE isMuted = 'true'`;
      
         const request = connection.request();
         const result = await request.query(query);
         connection.close();
         return result.recordset.map((row) => new MutedUsers(row.AccID, row.AccName));
     }

     //Retrieves muted users by name (as searched by user)
     static async getMutedUsersByName(accName) {
        const connection = await sql.connect(dbConfig);
        //Gets the muted user with AccName containing characters from input accName
        const query = 
        `SELECT AccID, AccName FROM Account WHERE AccName LIKE '%${accName}%' AND isMuted ='true'`;
    
        const request = connection.request();
        request.input("accName", accName);
        const result = await request.query(query);
        connection.close();
        return result.recordset.map((row) => new MutedUsers(row.AccID, row.AccName));
     }

     //Put operation makes user muted
     static async unmuteUser(accId) {
        const connection = await sql.connect(dbConfig);
        const query = 
        `UPDATE Account SET isMuted = 'false' WHERE AccId = @accId`;
    
        const request = connection.request();
        request.input("accId", accId);
        const result = await request.query(query);
        connection.close();

     }
 
     
    
 }
 
 module.exports = MutedUsers;