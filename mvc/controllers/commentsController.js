const Comment = require("../models/comment");

const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.getAllComments();
        res.json(comments);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving comments");
    }
};

const getCommentsByPost = async (req, res) => {
    const postId = parseInt(req.params.postId);
    try {
        const comments = await Comment.getCommentsByPost(postId);
        if (!comments) {
            return res(404).send("Comments not found");
        }
        res.json(comments);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving comments");
    }
};

module.exports = {
    getAllComments,
    getCommentsByPost,
};