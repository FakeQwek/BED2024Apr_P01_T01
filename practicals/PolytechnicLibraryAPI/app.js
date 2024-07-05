const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const userController = require("./mvc/controllers/userController");
const bookController = require("./mvc/controllers/bookController");
const registerController = require("./mvc/controllers/registerController");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/user/:username", userController.getUserByUsername);
app.post("/register", registerController.registerUser);
app.post("/user", userController.createUser);
app.post("/login", userController.login);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});