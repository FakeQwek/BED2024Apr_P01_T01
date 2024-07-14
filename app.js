const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Import controllers
const accountsController = require("./mvc/controllers/accountsController");
const postsController = require("./mvc/controllers/postsController");
const discussionController = require("./mvc/controllers/discussionController");
const commentsController = require("./mvc/controllers/commentsController");
const postReportsController = require("./mvc/controllers/postReportsController");
const discussionReportsController = require("./mvc/controllers/discussionReportsController");
const volunteersController = require("./mvc/controllers/volunteersController");
const discussionMembersController = require("./mvc/controllers/discussionMembersController");
const newsController = require("./mvc/controllers/newsController");
const baninfoController = require("./mvc/controllers/baninfoController");
const muteinfoController = require("./mvc/controllers/muteinfoController");
const questionController = require("./mvc/controllers/questionController");
const postLikesController = require("./mvc/controllers/postLikesController");

const app = express();
const port = process.env.PORT || 3000;

// Apply middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true,
    origin: true
}));
app.use(helmet());
app.use(morgan('combined')); // HTTP request logger

// Route definitions
app.delete('/deleteAccount', accountsController.deleteAccount); // Add this line
app.put('/updateProfile', accountsController.updateProfile);
app.post('/signup', accountsController.signup);
app.get('/login', accountsController.login);
app.get('/question', questionController.getAllQuestions);
app.get('/question/:questionId', questionController.getQuestionById);
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
app.get("/discussions/search", discussionController.searchDiscussions);
app.get("/discussions/:dscName", discussionController.getDiscussionByName);
app.get("/comments", commentsController.getAllComments);
app.get("/comments/:postId", commentsController.getCommentsByPost);
app.get("/postReports", postReportsController.getAllPostReports);
app.get("/postReports/:postRptId", postReportsController.getPostReportById);
app.get("/discussionReports", discussionReportsController.getAllDiscussionReports);
app.get("/discussionReports/:dscRptId", discussionReportsController.getDiscussionReportById);
app.get("/volunteers", volunteersController.getAllVolunteers);
app.get("/volunteers/:postId", volunteersController.getVolunteersByPost);
app.get("/baninfo/:accName", baninfoController.getBanInfo);
app.get("/muteinfo/:accName", muteinfoController.getMuteInfo);
app.get("/unapprovedposts/:dscName", postsController.getUnapprovedPostsByDiscussion);
app.post("/question", questionController.createQuestion);
app.post("/muteinfo", muteinfoController.addMuteInfo);
app.post("/baninfo", baninfoController.addBanInfo);
app.post("/postReport", postReportsController.createPostReport);
app.post("/discussionReport", discussionReportsController.createDiscussionReport);
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
app.put("/discussion/:dscName", discussionController.updateDiscussionDescription);
app.put("/comment/:cmtId", commentsController.updateComment);
app.put("/volunteer/:volId", volunteersController.approveVolunteer);
app.put("/accounts/unban/:accName", accountsController.unbanAccount);
app.put("/accounts/unmute/:accName", accountsController.unmuteUser);
app.post("/news", newsController.createNews);
app.put("/news/:newsId", newsController.updateNews);
app.delete("/news/:newsId", newsController.deleteNews);
app.delete("/comment/:cmtId", commentsController.deleteComment);
app.delete("/posts/:postId", postsController.deletePost);
app.delete("/volunteer/:volId", volunteersController.deleteVolunteer);
app.delete("/baninfo/:accName", baninfoController.removeBanInfo);
app.delete("/muteinfo/:accName", muteinfoController.removeMuteInfo);

app.get("/discussionMembers", discussionMembersController.getAllDiscussionMembers);
app.get("/discussionMembers/:dscName", discussionMembersController.getDiscussionMembersByDiscussion);
app.post("/discussionMember/:dscName", discussionMembersController.createDiscussionMember);

app.get("/postLikes", postLikesController.getAllPostLikes);
app.get("/postLikes/:postId", postLikesController.getPostLikesByPost);
app.post("/postLike", postLikesController.createPostLike);
app.delete("/postLike/:accName/:postId", postLikesController.deletePostLike);

// Start the server
app.listen(port, async () => {
    console.log(`Server listening on port ${port}`);
    try {
        await sql.connect(dbConfig);
        console.log("Database connection established successfully");
    } catch (err) {
        console.error("Database connection error:", err);
    }
});

process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    await sql.close();
    console.log("Database connection closed");
    process.exit(0);
});
