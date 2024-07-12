require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const userController = require("./mvc/controllers/userController");
const bookController = require("./mvc/controllers/bookController");
const registerController = require("./mvc/controllers/registerController");
const { verifyJWT, authorizeRoles } = require("./mvc/middleware/auth");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/register", registerController.registerUser);
app.post("/login", userController.login);

app.get("/books", verifyJWT, authorizeRoles('member', 'librarian'), bookController.getAllBooks);
app.put("/books/:bookId/availability", verifyJWT, authorizeRoles('librarian'), bookController.updateBookAvailability);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});