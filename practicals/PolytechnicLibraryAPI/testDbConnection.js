const sql = require('mssql');
const dbConfig = require('./dbConfig');

async function testConnection() {
    try {
        const connection = await sql.connect(dbConfig);
        console.log("Database connection successful");
        connection.close();
    } catch (err) {
        console.error("Database connection error:", err);
    }
}

testConnection();
