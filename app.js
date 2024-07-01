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
const baninfoController = require("./mvc/controllers/baninfoController");
const muteinfoController = require("./mvc/controllers/muteinfoController");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post('/signup', accountsController.signup);
app.get('/login', accountsController.login);

app.get("/news", newsController.getAllNews);
app.get("/news/:newsId", newsController.getNewsById);
app.get("/accounts", accountsController.getAllAccounts);
app.get("/accounts/:accName", accountsController.getAccountByName);
app.get("/bannedaccounts", accountsController.getAccountIsBanned);
app.get("/mutedaccounts", accountsController.getAccountsIsMuted);
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
app.get("/volunteer/:volId", volunteersController.getVolunteerById);
app.get("/volunteers/:postId", volunteersController.getVolunteersByPost);
app.get("/baninfo/:accName", baninfoController.getBanInfo);
app.get("/muteinfo/:accName", muteinfoController.getMuteInfo);
app.get("/unapprovedposts/:dscName", postsController.getUnapprovedPostsByDiscussion);
app.post("/muteinfo", muteinfoController.addMuteInfo);
app.post("/baninfo", baninfoController.addBanInfo); 
app.post("/postReport", postReportsController.createPostReport);
app.post("/discussion", discussionController.createDiscussion);
app.post("/comment", commentsController.createComment);
app.post("/post", postsController.createPost);
app.post("/volunteer", volunteersController.createVolunteer);
app.put('/promoteUser/:accName', accountsController.promoteUser);
app.put('/demoteUser/:accName', accountsController.demoteUser);
app.put("/accounts/mute/:accName", accountsController.muteUser);
app.put('/accounts/ban/:accName', accountsController.banUser);
app.put('/post/approve/:postId', postsController.approvePost);
app.put('/discussions/:dscName', discussionController.updateDiscussion);
app.put("/post/:postId", postsController.updatePost);
app.put("/volunteer/:volId", volunteersController.approveVolunteer);
app.put("/accounts/unban/:accName", accountsController.unbanAccount);
app.put("/accounts/unmute/:accName", accountsController.unmuteUser);
app.post("/news", newsController.createNews);
app.put("/news/:newsId", newsController.updateNews);
app.delete("/news/:newsId", newsController.deleteNews);
app.delete("/posts/:postId", postsController.deletePost);
app.delete("/volunteer/:volId", volunteersController.deleteVolunteer);
app.delete("/baninfo/:accName", baninfoController.removeBanInfo);
app.delete("/muteinfo/:accName", muteinfoController.removeMuteInfo);

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
