const bcrypt = require("bcryptjs");
const user = require("../controllers/userController");

async function registerUser(req, res) {
    const { username, password, role } = req.body;
  
    try {
      re1 = "/\d/";
      re2 = "/[\D\W]/";
      re3 = "/\s/";

      
      // Validate user data
      // ... your validation logic here ...

      if (username.length < 3 ) {
        return res.status(400).json({ message: "Username must be more than 3 characters"});
      }
      else if (re2.test(username)) {
        return res.status(400).json({ message: "Username must not have special characters"});
      }
      else if (re3.test(username)) {
        return res.status(400).json({message: "Username should not have any spaces"});
      }


      if (password.length < 8) {
          return res.status(400).json({ message: "Password must be more than 8 characters"});
      }
      else if (!re1.test(password)) {

        return res.status(400).json({ message: "Password must have at least one digit"});
      }
      else if (!re2.test(password)) {
        return res.status(400).json({ message: "Password must have at least one special character"});

      }
      else if (re3.test(password)) {
        return res.status(400).json({ message: "Password cannot have spaces"});
      }
      

      // Check for existing username
      const existingUser = await user.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create user in database
      // ... your database logic here ...
      const response = await fetch("http://localhost:3000/user", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            'Content-Type': "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            news_username: username,
            news_passwordHash: password,
            role: role,
            }),
    });
      return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  module.exports = {
    registerUser
  }