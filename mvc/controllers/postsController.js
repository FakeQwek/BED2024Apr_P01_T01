const Post = require("../models/post");

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.getAllPosts();
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving posts");
    }
};

const getAllPublicPosts = async (req, res) => {
    try {
        const posts = await Post.getAllPublicPosts();
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving posts");
    }
}

const getPostById = async (req, res) => {
    const postId = req.params.postId;
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

const getPostOwnerByPostId = async (req, res) => {
    const postId = parseInt(req.params.postId);
    try {
        const post = await Post.getPostOwnerByPostId(postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving post");
    }
}

const getPostsByDiscussion = async (req, res) => {
    const dscName = req.params.dscName;
    try {
        const posts = await Post.getPostsByDiscussion(dscName);
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving posts");
    }
};

const getPostsByDiscussionOrderByLikes = async (req, res) => {
    const dscName = req.params.dscName;
    try {
        const posts = await Post.getPostsByDiscussionOrderByLikes(dscName);
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving posts");
    }
};

const getPostsByDiscussionOrderByPostDate = async (req, res) => {
    const dscName = req.params.dscName;
    try {
        const posts = await Post.getPostsByDiscussionOrderByPostDate(dscName);
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving posts");
    }
}


const getUnapprovedPostsByDiscussion = async (req, res) => {
    const dscName = req.params.dscName;
    try {
        const posts = await Post.getUnapprovedPostsByDiscussion(dscName);
        res.json(posts);
    } catch (error) {
        console.error('Error fetching unapproved posts:', error);
        res.status(500).send("Error fetching unapproved posts");
    }
};

const createPost = async (req, res) => {
    const newPost = req.body;
    try {
        await Post.createPost(newPost);
        res.status(201).send("Post created successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating post");
    }
};

const updatePost = async (req, res) => {
    const postId = req.params.postId;
    const newPostData = req.body;
    try {
        const updatedPost = await Post.updatePost(postId, newPostData);
        if (!updatedPost) {
            return res.status(404).send("Post not found");
        }
        res.json(updatedPost);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating post");
    }
};

const deletePost = async (req, res) => {
    const postId = req.params.postId;
    try {
        const success = await Post.deletePost(postId);
        if (!success) {
            return res.status(404).send("Post not found");
        }
        res.status(204).send();
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting post");
    }
};

const admindeletePost = async (req, res) => {
    const postId = req.params.postId;
    try {
        const success = await Post.deletePost(postId);
        if (!success) {
            return res.status(404).send("Post not found");
        }
        res.status(204).send();
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting post");
    }
};

const approvePost = async (req, res) => {
    const postId = req.params.postId;
    try {
        await Post.approvePost(postId);
        res.status(200).send("Post approved successfully");
    } catch (error) {
        console.error('Error approving post:', error);
        res.status(500).send("Error approving post");
    }
};

module.exports = {
    getAllPosts,
    getAllPublicPosts,
    getPostById,
    getPostOwnerByPostId,
    getPostsByDiscussion,
    getPostsByDiscussionOrderByLikes,
    getPostsByDiscussionOrderByPostDate,
    createPost,
    deletePost,
    updatePost,
    getUnapprovedPostsByDiscussion,
    approvePost,
    admindeletePost
};
