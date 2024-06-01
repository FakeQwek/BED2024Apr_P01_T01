const Post = require("../models/post");

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.getAllPosts();
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving post");
    }
};

const getPostById = async (req, res) => {
    const postId = parseInt(req.params.postId);
    try {
        const post = await Post.getPostById(postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving post");
    }
};

const createPost = async (req, res) => {
    const newPost = req.body;
    try {
        const createdPost = await Post.createPost(newPost);
        res.status(201).json(createdPost);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating post");
    }
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
};