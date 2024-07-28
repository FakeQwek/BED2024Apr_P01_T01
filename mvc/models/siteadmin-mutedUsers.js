
 const sql =  require("mssql");
 const dbConfig = require("../../dbConfig");
 const { request } = require("express");
 
 
 
 class MutedUsers {
     constructor(accName) {
       
        this.accName = accName;
     }
     
     //Retrieves all muted users
     static async getAllMutedUsers() {
         
         const connection = await sql.connect(dbConfig);
         const query = 
         `SELECT AccName FROM Account WHERE isMuted = 'True'`;
      
         const request = connection.request();
         const result = await request.query(query);
         connection.close();
         return result.recordset.map((row) => new MutedUsers(row.AccName));
     }

     //Retrieves muted users by name (as searched by user)
     static async getMutedUsersByName(accName) {
        const connection = await sql.connect(dbConfig);
        //Gets the muted user with AccName containing characters from input accName
        const query = 
        `SELECT AccName FROM Account WHERE AccName LIKE '%${accName}%' AND isMuted ='True'`;
    
        const request = connection.request();
        request.input("accName", accName);
        const result = await request.query(query);
        connection.close();
        return result.recordset.map((row) => new MutedUsers(row.AccName));
     }

     //Put operation makes user muted
     static async unmuteUser(accName) {
        const connection = await sql.connect(dbConfig);
        const query = 
        `UPDATE Account SET isMuted = 'False' WHERE AccName = @accName`;
    
        const request = connection.request();
        request.input("accName", accName);
        const result = await request.query(query);
        connection.close();

     }
 
     
    
 }
 
 module.exports = MutedUsers;