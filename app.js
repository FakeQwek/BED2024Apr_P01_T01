const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require('bcrypt');

const accountsController = require("./mvc/controllers/accountsController");
const postsController = require("./mvc/controllers/postsController");
const discussionController = require("./mvc/controllers/discussionController");
const commentsController = require("./mvc/controllers/commentsController");
const postReportsController = require("./mvc/controllers/postReportsController");
const discussionReportsController = require("./mvc/controllers/discussionReportsController");
const volunteersController = require("./mvc/controllers/volunteersController");
const discussionMembersController = require("./mvc/controllers/discussionMembersController");
const newsController = require("./mvc/controllers/newsController");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Signup route
app.post('/signup', async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
        console.log('Both fields are required');
        return res.status(400).send('Both fields are required');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const pool = await sql.connect(dbConfig);

        // Determine if the input is an email or username
        const isEmail = usernameOrEmail.includes('@');
        const username = isEmail ? usernameOrEmail.split('@')[0] : usernameOrEmail;
        const email = isEmail ? usernameOrEmail : null;

        const result = await pool.request()
            .input('AccName', sql.VarChar, username)
            .input('AccEmail', sql.VarChar, email)
            .input('Password', sql.VarChar, hashedPassword)
            .input('isAdmin', sql.VarChar, 'False')
            .input('isMuted', sql.VarChar, 'False')
            .input('isBanned', sql.VarChar, 'False')
            .query(`INSERT INTO Account (AccName, AccEmail, Password, isAdmin, isMuted, isBanned) 
                    VALUES (@AccName, @AccEmail, @Password, @isAdmin, @isMuted, @isBanned)`);

        res.status(201).send('User created successfully');
    } catch (err) {
        console.error('Database insertion error:', err.originalError ? err.originalError.message : err.message);
        res.status(500).send('Server error');
    }
});

// Login route
app.get('/login', async (req, res) => {
    const { usernameOrEmail, password } = req.query;

    if (!usernameOrEmail || !password) {
        return res.status(400).send('Both fields are required');
    }

    try {
        const pool = await sql.connect(dbConfig);

        // Determine if the input is an email or username
        const isEmail = usernameOrEmail.includes('@');
        const username = isEmail ? null : usernameOrEmail;
        const email = isEmail ? usernameOrEmail : null;

        const result = await pool.request()
            .input('AccName', sql.VarChar, username)
            .input('AccEmail', sql.VarChar, email)
            .query(`SELECT * FROM Account WHERE (AccName = @AccName OR AccEmail = @AccEmail)`);

        if (result.recordset.length === 0) {
            return res.status(404).send('Your username/email did not sign up');
        }

        const user = result.recordset[0];

        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (passwordMatch) {
            const userData = {
                username: user.AccName,
                email: user.AccEmail
            };
            return res.status(200).json(userData);
        } else {
            return res.status(401).send('Login failed');
        }
    } catch (err) {
        console.error('Database error:', err.originalError ? err.originalError.message : err.message);
        res.status(500).send('Server error');
    }
});

// Signup route
app.post('/signup', async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
        console.log('Both fields are required');
        return res.status(400).send('Both fields are required');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const pool = await sql.connect(dbConfig);

        // Determine if the input is an email or username
        const isEmail = usernameOrEmail.includes('@');
        const username = isEmail ? usernameOrEmail.split('@')[0] : usernameOrEmail;
        const email = isEmail ? usernameOrEmail : null;

        const result = await pool.request()
            .input('AccName', sql.VarChar, username)
            .input('AccEmail', sql.VarChar, email)
            .input('Password', sql.VarChar, hashedPassword)
            .input('isAdmin', sql.VarChar, 'False')
            .input('isMuted', sql.VarChar, 'False')
            .input('isBanned', sql.VarChar, 'False')
            .query(`INSERT INTO Account (AccName, AccEmail, Password, isAdmin, isMuted, isBanned) 
                    VALUES (@AccName, @AccEmail, @Password, @isAdmin, @isMuted, @isBanned)`);

        res.status(201).send('User created successfully');
    } catch (err) {
        console.error('Database insertion error:', err.originalError ? err.originalError.message : err.message);
        res.status(500).send('Server error');
    }
});

// Login route
app.get('/login', async (req, res) => {
    const { usernameOrEmail, password } = req.query;

    if (!usernameOrEmail || !password) {
        return res.status(400).send('Both fields are required');
    }

    try {
        const pool = await sql.connect(dbConfig);

        // Determine if the input is an email or username
        const isEmail = usernameOrEmail.includes('@');
        const username = isEmail ? null : usernameOrEmail;
        const email = isEmail ? usernameOrEmail : null;

        const result = await pool.request()
            .input('AccName', sql.VarChar, username)
            .input('AccEmail', sql.VarChar, email)
            .query(`SELECT * FROM Account WHERE (AccName = @AccName OR AccEmail = @AccEmail)`);

        if (result.recordset.length === 0) {
            return res.status(404).send('Your username/email did not sign up');
        }

        const user = result.recordset[0];

        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (passwordMatch) {
            const userData = {
                username: user.AccName,
                email: user.AccEmail
            };
            return res.status(200).json(userData);
        } else {
            return res.status(401).send('Login failed');
        }
    } catch (err) {
        console.error('Database error:', err.originalError ? err.originalError.message : err.message);
        res.status(500).send('Server error');
    }
});

app.get("/news", newsController.getAllNews);
app.get("/news/:newsId", newsController.getNewsById);
app.get("/accounts", accountsController.getAllAccounts);
app.get("/accounts/:accName", accountsController.getAccountByName);
app.get("/posts", postsController.getAllPosts);
app.get("/posts/:dscName", postsController.getPostsByDiscussion);
app.get("/post/:postId", postsController.getPostById);
app.get("/discussions", discussionController.getAllDiscussions);
app.get("/discussions/search", discussionController.searchDiscussions);
app.get("/discussions/:dscName", discussionController.getDiscussionByName);
app.get("/comments", commentsController.getAllComments);
app.get("/comments/:postId", commentsController.getCommentsByPost);
app.get("/postReports", postReportsController.getAllPostReports);
app.get("/postReports/:postRptId", postReportsController.getPostReportById);
app.get("/discussionReports", discussionReportsController.getAllDiscussionReports);
app.get("/discussionReports/:dscRptId", discussionReportsController.getDiscussionReportById);
app.get("/volunteers", volunteersController.getAllVolunteers);
app.get("/volunteer/:volId", volunteersController.getVolunteerById);
app.get("/volunteers/:postId", volunteersController.getVolunteersByPost);
app.post("/postReport", postReportsController.createPostReport);
app.post("/discussionReport", discussionReportsController.createDiscussionReport);
app.post("/discussion", discussionController.createDiscussion);
app.post("/comment", commentsController.createComment);
app.post("/post", postsController.createPost);
app.post("/volunteer", volunteersController.createVolunteer);
app.put("/post/:postId", postsController.updatePost);
app.put("/discussion/:dscName", discussionController.updateDiscussionDescription);
app.put("/comment/:cmtId", commentsController.updateComment);
app.put("/volunteer/:volId", volunteersController.approveVolunteer);
app.post("/news", newsController.createNews);
app.put("/news/:newsId", newsController.updateNews);
app.delete("/news/:newsId", newsController.deleteNews);
app.delete("/comment/:cmtId", commentsController.deleteComment);
app.delete("/posts/:postId", postsController.deletePost);
app.delete("/volunteer/:volId", volunteersController.deleteVolunteer);

app.get("/discussionMembers", discussionMembersController.getAllDiscussionMembers);
app.post("/discussionMember/:dscName", discussionMembersController.createDiscussionMember);

app.listen(port, async () => {
    try {
        await sql.connect(dbConfig);
        console.log("Database connection established successfully");
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }

    console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    await sql.close();
    console.log("Database connection closed");
    process.exit(0);
});



























