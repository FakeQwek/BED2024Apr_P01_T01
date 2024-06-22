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
const newsController = require("./mvc/controllers/newsController");

const app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/news", newsController.getAllNews);
app.get("/news/:newsId", newsController.getNewsById);
app.get("/accounts", accountsController.getAllAccounts);
app.get("/accounts/:accId", accountsController.getAccountById);
app.get("/posts", postsController.getAllPosts);
app.get("/posts/:dscId", postsController.getPostsByDiscussion);
//app.get("/posts/:postId", postsController.getPostById);
app.get("/discussions", discussionController.getAllDiscussions);
app.get("/discussions/:dscId", discussionController.getDiscussionById);
app.get("/comments", commentsController.getAllComments);
app.get("/comments/:postId", commentsController.getCommentsByPost);
app.get("/postReports", postReportsController.getAllPostReports);
app.get("/postReports/:postRptId", postReportsController.getPostReportById);
app.get("/volunteers", volunteersController.getAllVolunteers);
app.get("/volunteers/:volId", volunteersController.getVolunteerById);
app.post("/news", newsController.createNews);
app.post("/postReports", postReportsController.createPostReport);
app.post("/discussions", discussionController.createDiscussion);
app.post("/posts", postsController.createPost);
app.post("/volunteers", volunteersController.createVolunteer);
app.put("/posts/:postId", postsController.updatePost);
app.put("/news/:newsId", newsController.updateNews);
app.delete("/news/:newsId", newsController.deleteNews);
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