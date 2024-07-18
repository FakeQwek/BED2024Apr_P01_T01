const swaggerAutogen = require("swagger-autogen")();
const outputFile = "./swagger-output.json";
const routes = ["./app.js"]; //Path to your API route files

const doc = {
    info: {
        title: "My API",
        description: "Description of your API",

    },
    host: "localhost:3000",

};
swaggerAutogen(outputFile, routes, doc);