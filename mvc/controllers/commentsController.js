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

const getCommentOwnerByCommentId = async (req, res) => {
    const cmtId = parseInt(req.params.cmtId);
    try {
        const comment = await Comment.getCommentOwnerByCommentId(cmtId);
        if (!comment) {
            return res.status(404).send("Comment not found");
        }
        res.json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving comment");
    }
}

const getCommentsByUser = async (req, res) => {
    const username = req.params.username;
    try {
        const comments = await Comment.getCommentsByUser(username);
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

const updateComment = async(req, res) => {
    const cmtId = parseInt(req.params.cmtId);
    const newCommentData = req.body;
    try {
        const updatedComment = await Comment.updateComment(cmtId, newCommentData);
        if (!updatedComment) {
            return res.status(404).send("Comment not found");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating comment");
    }
}

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
    getCommentOwnerByCommentId,
    createComment,
    updateComment,
    deleteComment,
    getCommentsByUser,
};
