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
    const postId = req.params.postId;
    try {
        const comments = await Comment.getCommentsByPost(postId);
        res.json(comments);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving comments");
    }
};

const createComment = async (req, res) => {
    const newComment = req.body;
    try {
        await Comment.createComment(newComment);
        res.status(201).send("Comment created successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating comment");
    }
};

module.exports = {
    getAllComments,
    getCommentsByPost,
    createComment,
};
