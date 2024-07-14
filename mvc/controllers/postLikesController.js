const Post = require("../models/post");
const PostLike = require("../models/postLike");

const getAllPostLikes = async (req, res) => {
    try {
        const postLikes = await PostLike.getAllPostLikes();
        res.json(postLikes);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving post likes");
    }
};

const getPostLikesByPost = async (req, res) => {
    const postId = parseInt(req.params.postId);
    try {
        const postLikes = await PostLike.getPostLikesByPost(postId);
        if (!postLikes) {
            return res.status(404).send("Post likes not found");
        }
        res.json(postLikes);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving post likes");
    }
};

const createPostLike = async (req, res) => {
    const newPostLikeData = req.body;
    try {
        const createdPostLike = await PostLike.createPostLike(newPostLikeData);
        res.status(201).json(createdPostLike);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating post like");
    }
};

module.exports = {
    getAllPostLikes,
    getPostLikesByPost,
    createPostLike,
}