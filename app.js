const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser");
const cors = require("cors");

const accountsController = require("./mvc/controllers/accountsController");
const postsController = require("./mvc/controllers/postsController");
const discussionController = require("./mvc/controllers/discussionController");
const commentsController = require("./mvc/controllers/commentsController");
const postReportsController = require("./mvc/controllers/postReportsController");
const volunteersController = require("./mvc/controllers/volunteersController");

const app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/accounts", accountsController.getAllAccounts);
app.get("/accounts/:accName", accountsController.getAccountByName);
app.get("/posts", postsController.getAllPosts);
app.get("/posts/:dscName", postsController.getPostsByDiscussion);
app.get("/post/:postId", postsController.getPostById);
app.get("/discussions", discussionController.getAllDiscussions);
app.get("/discussions/:dscName", discussionController.getDiscussionByName);
app.get("/comments", commentsController.getAllComments);
app.get("/comments/:postId", commentsController.getCommentsByPost);
app.get("/postReports", postReportsController.getAllPostReports);
app.get("/postReports/:postRptId", postReportsController.getPostReportById);
app.get("/volunteers", volunteersController.getAllVolunteers);
app.get("/volunteers/:volId", volunteersController.getVolunteerById);
app.post("/postReport", postReportsController.createPostReport);
app.post("/discussion", discussionController.createDiscussion);
app.post("/comment", commentsController.createComment);
app.post("/post", postsController.createPost);
app.post("/volunteer", volunteersController.createVolunteer);
app.put("/post/:postId", postsController.updatePost);
app.delete("/posts/:postId", postsController.deletePost);

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