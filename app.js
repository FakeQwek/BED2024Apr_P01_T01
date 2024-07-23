const express = require("express");
const sql = require("mssql");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const dbConfig = require("./dbConfig");

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
const invitesController = require("./mvc/controllers/invitesController");
const siteadminPostReportController = require("./mvc/controllers/siteadminPostReportController");

// import middlewares
const verifyDiscussionOwner = require("./mvc/middlewares/verifyDiscussionOwner");
const verifyPostOwner = require("./mvc/middlewares/verifyPostOwner");
const verifyDiscussionMember = require("./mvc/middlewares/verifyDiscussionMember");
const verifyCommentOwner = require("./mvc/middlewares/verifyCommentOwner");
const verifyAccount = require("./mvc/middlewares/verifyAccount");


const app = express();
const port = process.env.PORT || 3000;

const JWT_SECRET = '3f3a94e1c0b5f11a8e0f2747d2a5e2f7a9a1c3b7d4d6e1e2f7b8c9d1a3e4f6a2'; // Replace with your own secret

const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).send('Access denied. No token provided.');

    const token = authHeader.split(' ')[1]; // Assuming the format is "Bearer TOKEN"
    if (!token) return res.status(401).send('Access denied. Invalid token format.');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
};

// Apply middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true,
    origin: true
}));
// app.use(helmet());
// app.use(morgan('combined')); // HTTP request logger

// Route definitions
app.delete('/deleteAccount', accountsController.deleteAccount);
app.put('/updateProfile', accountsController.updateProfile);
app.post('/signup', accountsController.signup);
app.post('/login', accountsController.login);
app.get('/ping', (req, res) => res.send('Server is running')); // Simple ping endpoint

app.get('/siteadminPostReport', siteadminPostReportController.getAllPostReports);
app.get('/login', accountsController.login);
app.get('/question', questionController.getAllQuestions);
app.get('/question/:questionId', questionController.getQuestionById);
app.get("/news", newsController.getAllNews);
app.get("/news/:newsId", newsController.getNewsById);
app.get("/accounts", accountsController.getAllAccounts);
app.get("/accounts/:accName", verifyAccount, accountsController.getAccountByName);
app.get("/bannedaccounts", accountsController.getAccountIsBanned);
app.get("/mutedaccounts", accountsController.getAccountsIsMuted);

// post
app.get("/posts", postsController.getAllPosts); // admin
app.get("/posts/:dscName", verifyDiscussionMember, postsController.getPostsByDiscussion); // member
app.get("/postsOrderByLikes/:dscName", verifyDiscussionMember, postsController.getPostsByDiscussionOrderByLikes); // member
app.get("/post/:postId", postsController.getPostById); // public
app.get("/postOwner/:postId", postsController.getPostOwnerByPostId); // public
app.post("/post/:dscName", verifyDiscussionMember, postsController.createPost); // member
app.put('/post/approve/:postId', postsController.approvePost);
app.put("/post/:postId", verifyPostOwner, postsController.updatePost); // post owner

// discussion
app.get("/discussions", discussionController.getAllDiscussions); // admin
app.get("/discussions/search", discussionController.searchDiscussions); // public
app.get("/discussions/:dscName", discussionController.getDiscussionByName); // public
app.post("/discussion", discussionController.createDiscussion); // logged in user
app.put('/discussions/:dscName', discussionController.updateDiscussion); // discussion owner?
app.put("/discussion/:dscName", verifyDiscussionOwner, discussionController.updateDiscussionDescription); // discussion owner

// comment
app.get("/comments", commentsController.getAllComments); // admin
app.get("/comments/:dscName/:postId", verifyDiscussionMember, commentsController.getCommentsByPost); // member
app.get("/commentOwner/:cmtId", commentsController.getCommentOwnerByCommentId); // public
app.post("/comment/:dscName", verifyDiscussionMember, commentsController.createComment); // member
app.put("/comment/:cmtId", verifyCommentOwner, commentsController.updateComment); // comment owner
app.delete("/comment/:cmtId", verifyCommentOwner, commentsController.deleteComment); // comment owner

// post report
app.get("/postReports", postReportsController.getAllPostReports); // admin
app.get("/postReports/:postRptId", postReportsController.getPostReportById); // public
app.post("/postReport/:dscName", verifyDiscussionMember, postReportsController.createPostReport); // member
app.delete("/posts/:postId", verifyPostOwner, postsController.deletePost); // discussion admin

// discussion report
app.get("/discussionReports", discussionReportsController.getAllDiscussionReports); // admin
app.get("/discussionReports/:dscRptId", discussionReportsController.getDiscussionReportById); // public
app.post("/discussionReport/:dscName", verifyDiscussionMember, discussionReportsController.createDiscussionReport); // logged in user
app.delete("/discussionReports/:dscRptId", discussionReportsController.deleteDiscussionReport); // admin

// volunteer
app.get("/volunteers", volunteersController.getAllVolunteers); // admin
app.get("/volunteers/:postId", verifyPostOwner, volunteersController.getVolunteersByPost); // post owner
app.post("/volunteer/:dscName", verifyDiscussionMember, volunteersController.createVolunteer); // member
app.put("/volunteer/:postId/:volId", verifyPostOwner, volunteersController.approveVolunteer); // post owner
app.delete("/volunteer/:postId/:volId", verifyPostOwner, volunteersController.deleteVolunteer); // post owner

// discussion member
app.get("/discussionMembers", discussionMembersController.getAllDiscussionMembers); // admin
app.get("/discussionMembers/:dscName", discussionMembersController.getDiscussionMembersByDiscussion); // public
app.get("/discussionMemberTop3Discussions/:accName", discussionMembersController.getDiscussionMemberTop3Discussions); // self
app.post("/discussionMember/:dscName", discussionMembersController.createDiscussionMember); // logged in user
app.delete("/discussionMember/:accName/:dscName", verifyDiscussionMember, discussionMembersController.deleteDiscussionMember); // member

// post like
app.get("/postLikes", postLikesController.getAllPostLikes); // admin
app.get("/postLikes/:dscName/:postId", verifyDiscussionMember, postLikesController.getPostLikesByPost); // member
app.post("/postLike/:dscName", verifyDiscussionMember, postLikesController.createPostLike); // member
app.delete("/postLike/:accName/:postId/:dscName", postLikesController.deletePostLike); //member

// invite
app.get("/invites", invitesController.getAllInvites); //admin
app.get("/invites/:dscName", invitesController.getInvitesByDiscussion); // discussion admin
app.post("/invite", invitesController.createInvite); // discussion admin
app.delete("/invite/:invId", invitesController.deleteInvite); // discussion admin


app.get("/baninfo/:accName", baninfoController.getBanInfo);
app.get("/muteinfo/:accName", muteinfoController.getMuteInfo);
app.get("/unapprovedposts/:dscName", postsController.getUnapprovedPostsByDiscussion);
app.post("/question", questionController.createQuestion);
app.post("/muteinfo", muteinfoController.addMuteInfo);
app.post("/baninfo", baninfoController.addBanInfo);
app.post('/signup', accountsController.signup);
app.post('/login', accountsController.login);
app.post("/news", newsController.createNews);
app.put('/promoteUser/:accName', accountsController.promoteUser);
app.put('/demoteUser/:accName', accountsController.demoteUser);
app.put("/accounts/mute/:accName", accountsController.muteUser);
app.put('/accounts/ban/:accName', accountsController.banUser);
app.put("/accounts/unban/:accName", accountsController.unbanAccount);
app.put("/accounts/unmute/:accName", accountsController.unmuteUser);
app.put('/updateProfile', accountsController.updateProfile);
app.put("/news/:newsId", newsController.updateNews);
app.delete("/news/:newsId", newsController.deleteNews);
app.delete("/baninfo/:accName", baninfoController.removeBanInfo);
app.delete("/muteinfo/:accName", muteinfoController.removeMuteInfo);
app.delete("/siteadminApprove/:reportId", siteadminPostReportController.deletePostReport);
app.delete("/siteadminDeny/:postId", siteadminPostReportController.deletePostReport);
app.delete("/siteadminPost/:postId", siteadminPostReportController.deletePost);
app.delete('/deleteAccount', accountsController.deleteAccount);

// Example protected route
app.get('/protected', authenticateJWT, (req, res) => {
    res.send('This is a protected route');
});


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
