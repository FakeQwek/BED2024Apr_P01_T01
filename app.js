const express = require("express");
const sql = require("mssql");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const dbConfig = require("./dbConfig");

// swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec

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
const invitesController = require("./mvc/controllers/invitesController");
const siteadminPostReportController = require("./mvc/controllers/siteadminPostReportController");
const feedbackController = require("./mvc/controllers/feedbackController");

const verifyDiscussionOwner = require("./mvc/middlewares/verifyDiscussionOwner");
const verifyPostOwner = require("./mvc/middlewares/verifyPostOwner");
const verifyDiscussionMember = require("./mvc/middlewares/verifyDiscussionMember");
const verifyCommentOwner = require("./mvc/middlewares/verifyCommentOwner");
const verifyAccount = require("./mvc/middlewares/verifyAccount");
const verifyDiscussionAdmin = require("./mvc/middlewares/verifyDiscussionAdmin");

const app = express();
const port = process.env.PORT || 3000;

const JWT_SECRET = '3f3a94e1c0b5f11a8e0f2747d2a5e2f7a9a1c3b7d4d6e1e2f7b8c9d1a3e4f6a2';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).send('Access denied. No token provided.');

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Access denied. Invalid token format.');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true,
    origin: true
}));
app.use(helmet());
app.use(morgan('combined'));

// Routes
app.delete('/deleteAccount', accountsController.deleteAccount);
app.put('/updateProfile', accountsController.updateProfile);
app.post('/signup', accountsController.signup);
app.post('/login', accountsController.login);
app.get('/ping', (req, res) => res.send('Server is running'));

app.get('/siteadminPostReport', siteadminPostReportController.getAllPostReports);
app.get('/postReports/:discussionName', discussionMembersController.getPostReportsByDiscussion);
app.get('/login', accountsController.login);
app.get('/question', questionController.getAllQuestions);
app.get('/question/:questionId', questionController.getQuestionById);
app.get("/news", newsController.getAllNews);
app.get("/news/:newsId", newsController.getNewsById);
app.get("/accounts", accountsController.getAllAccounts);
app.get("/accounts/:accName", verifyAccount, accountsController.getAccountByName);
app.get("/bannedaccounts", accountsController.getAccountIsBanned);
app.get("/mutedaccounts", accountsController.getAccountsIsMuted);
app.get("/bannedaccount/:dscName", discussionMembersController.getAccountIsBanned);
app.get("/mutedaccount/:dscName", discussionMembersController.getAccountsIsMuted);

// Post routes
app.get("/posts", postsController.getAllPosts); // admin
app.get("/publicPosts", postsController.getAllPublicPosts);
app.get("/posts/:dscName", verifyDiscussionMember, postsController.getPostsByDiscussion); // member
app.get("/postsOrderByLikes/:dscName", verifyDiscussionMember, postsController.getPostsByDiscussionOrderByLikes); // member
app.get("/postsOrderByDate/:dscName", verifyDiscussionMember, postsController.getPostsByDiscussionOrderByPostDate); // member
app.get("/post/:postId", postsController.getPostById); // public
app.get("/postOwner/:postId", postsController.getPostOwnerByPostId); // public
app.post("/post/:dscName", verifyDiscussionMember, postsController.createPost); // member
app.put('/post/approve/:postId', postsController.approvePost);
app.put("/post/:postId", verifyPostOwner, postsController.updatePost); // post owner
app.get("/posts/user/:username", postsController.getPostsByUser); // New route

// Discussion routes
app.get("/discussions", discussionController.getAllDiscussions); // admin
app.get("/discussions/search", discussionController.searchDiscussions); // public
app.get("/discussions/:dscName", discussionController.getDiscussionByName); // public
app.post("/discussion", discussionController.createDiscussion); // logged in user
app.put("/discussions/:dscName", discussionController.updateDiscussion); // discussion owner?
app.put("/discussion/:dscName", verifyDiscussionOwner, discussionController.updateDiscussionDescription); // discussion owner

// Comment routes
app.get("/comments", commentsController.getAllComments); // admin
app.get("/comments/:dscName/:postId", verifyDiscussionMember, commentsController.getCommentsByPost); // member
app.get("/commentOwner/:cmtId", commentsController.getCommentOwnerByCommentId); // public
app.post("/comment/:dscName", verifyDiscussionMember, commentsController.createComment); // member
app.put("/comment/:cmtId", verifyCommentOwner, commentsController.updateComment); // comment owner
app.delete("/comment/:cmtId", verifyCommentOwner, commentsController.deleteComment); // comment owner
app.get("/comments/user/:username", commentsController.getCommentsByUser); // New route
app.delete("/comments/:postId", commentsController.deleteCommentsByPost); // discussion admin

// Post report routes
app.get("/postReports", postReportsController.getAllPostReports); // admin
app.get("/postReports/:postRptId", postReportsController.getPostReportById); // public
app.post("/postReport/:dscName", verifyDiscussionMember, postReportsController.createPostReport); // member
app.delete("/posts/:postId", verifyPostOwner, postsController.deletePost); // member
app.delete("/post/:postId", postsController.admindeletePost); // discussion admin

// Discussion report routes
app.get("/discussionReports", discussionReportsController.getAllDiscussionReports); // admin
app.get("/discussionReports/:dscRptId", discussionReportsController.getDiscussionReportById); // public
app.post("/discussionReport/:dscName", verifyDiscussionMember, discussionReportsController.createDiscussionReport); // logged in user
app.put('/discussionReports/warn/:dscRptId', discussionReportsController.warnDiscussionReport);
app.delete("/discussionReports/:dscRptId", discussionReportsController.deleteDiscussionReport); // admin

// Volunteer routes
app.get("/volunteers", volunteersController.getAllVolunteers); // admin
app.get("/volunteers/:postId", verifyPostOwner, volunteersController.getVolunteersByPost); // post owner
app.post("/volunteer/:dscName", verifyDiscussionMember, volunteersController.createVolunteer); // member
app.put("/volunteer/:postId/:volId", verifyPostOwner, volunteersController.approveVolunteer); // post owner
app.delete("/volunteer/:postId/:volId", verifyPostOwner, volunteersController.deleteVolunteer); // post owner

// Discussion member routes
app.get("/discussionMembers", discussionMembersController.getAllDiscussionMembers); // admin
app.get("/discussionMembers/:dscName", discussionMembersController.getDiscussionMembersByDiscussion); // public
app.get("/discussionMemberTop3Discussions/:accName", discussionMembersController.getDiscussionMemberTop3Discussions); // self
app.post("/discussionMember/:dscName", discussionMembersController.createDiscussionMember); // logged in user
app.delete("/discussionMember/:accName/:dscName", verifyDiscussionMember, discussionMembersController.deleteDiscussionMember); // member

// Post like routes
app.get("/postLikes", postLikesController.getAllPostLikes); // admin
app.get("/postLikes/:dscName/:postId", verifyDiscussionMember, postLikesController.getPostLikesByPost); // member
app.post("/postLike/:dscName", verifyDiscussionMember, postLikesController.createPostLike); // member
app.delete("/postLike/:accName/:postId/:dscName", postLikesController.deletePostLike); // member

// Invite routes
app.get("/invites", invitesController.getAllInvites); // admin
app.get("/invites/:dscName", invitesController.getInvitesByDiscussion); // discussion admin
app.post("/invite", invitesController.createInvite); // discussion admin
app.delete("/invite/:invId", invitesController.deleteInvite); // discussion admin

// Additional routes
app.get("/baninfo/:accName/:dscName", baninfoController.getBanInfo);
app.get("/muteinfo/:accName/:dscName", muteinfoController.getMuteInfo);
app.get("/unapprovedposts/:dscName", postsController.getUnapprovedPostsByDiscussion);
app.post("/question", questionController.createQuestion);
app.post("/muteinfo", muteinfoController.addMuteInfo);
app.post("/baninfo", baninfoController.addBanInfo);
app.post("/signup", accountsController.signup);
app.post("/login", accountsController.login);
app.post("/news", newsController.createNews);
app.put('/promoteUser/:accName', accountsController.promoteUser);
app.put('/demoteUser/:accName', accountsController.demoteUser);
app.put("/promoteUsers/:accName/:dscName", discussionMembersController.promoteUser);
app.put("/appendAdmin/:accName/:dscName", discussionMembersController.appendAdmin);
app.put("/demoteUsers/:accName/:dscName", discussionMembersController.demoteUser);
app.put("/removeAdmin/:accName/:dscName", discussionMembersController.removeAdmin);
app.put("/accounts/mute/:accName", accountsController.muteUser);
app.put("/account/mute/:accName/:dscName", discussionMembersController.muteUser);
app.put('/accounts/ban/:accName', accountsController.banUser);
app.put('/account/ban/:accName/:dscName', discussionMembersController.banUser);
app.put("/accounts/unban/:accName", accountsController.unbanAccount);
app.put("/account/unban/:accName/:dscName", discussionMembersController.unbanAccount);
app.put("/accounts/unmute/:accName", accountsController.unmuteUser);
app.put("/account/unmute/:accName/:dscName", discussionMembersController.unmuteUser);
app.put('/updateProfile', accountsController.updateProfile);
app.put("/news/:newsId", newsController.updateNews);
app.delete("/news/:newsId", newsController.deleteNews);
app.delete("/baninfo/:accName/:dscName", baninfoController.removeBanInfo);
app.delete("/muteinfo/:accName/:dscName", muteinfoController.removeMuteInfo);
app.delete("/postReport/:postId", postReportsController.deletePostReport);
app.delete("/siteadminApprove/:reportId", siteadminPostReportController.deletePostReport);
app.delete("/siteadminDeny/:postId", siteadminPostReportController.deletePostReport);
app.delete("/siteadminPost/:postId", siteadminPostReportController.deletePost);

// Feedback routes
app.post('/feedback', feedbackController.createFeedback);
app.get('/feedback', feedbackController.getFeedback);
app.put('/feedback/:feedbackID', feedbackController.updateFeedback);
app.delete('/feedback/:feedbackID', feedbackController.deleteFeedback);

app.get('/protected', authenticateJWT, (req, res) => {
    res.send('This is a protected route');
});

// swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
