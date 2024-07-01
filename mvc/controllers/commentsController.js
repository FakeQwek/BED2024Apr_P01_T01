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
        res.json(comments);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving comments");
    }
};

const createComment = async (req, res) => {
    const newComment = req.body;
    try {
        const createdComment = await Comment.createComment(newComment);
        res.status(201).json(createComment);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating comment");
    }
};

const deleteComment = async (req, res) => {
    const cmtId = parseInt(req.params.cmtId);
    try {
        const success = await Comment.deleteComment(cmtId);
        if (!success) {
            return res.status(404).send("Comment not found")
        }
        res.status(204).send();
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting comment");
    }
};

module.exports = {
    getAllComments,
    getCommentsByPost,
    createComment,
    deleteComment,
};