/*const dbConfig = {
    user: "socialise_admin", // Replace with your SQL Server login username
    password: "123", // Replace with your SQL Server login password
    server: "localhost",
    database: "socialise",
    trustServerCertificate: true,
    options: {
        port: 1433, // Default SQL Server port
        connectionTimeout: 60000, // Connection timeout in milliseconds
        encrypt: true, // Use this if you're on Azure or you need encryption
        trustServerCertificate: true // Use this if you're on a local machine
    },
};

module.exports = dbConfig;*/

module.exports = {
    user: "socialise_admin", // Replace with your SQL Server login username
    password: "123", // Replace with your SQL Server login password
    server: "localhost",
    database: "socialise",
    trustServerCertificate: true,
    options: {
    port: 1433, // Default SQL Server port
    connectionTimeout: 60000, // Connection timeout in milliseconds
    },
};
